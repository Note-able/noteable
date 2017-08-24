const chai = require('chai');
const mocha = require('mocha');
const request = require('supertest');
const app = require('../lib/src/server/server');
const uuidV4 = require('uuid/v4');

const assert = chai.assert;

mocha.describe('Message API tests', () => {
  const agent = request.agent(app);
  let userId1;
  let userId2;
  let userId3;
  const id1 = uuidV4();
  const id2 = uuidV4();
  const id3 = uuidV4();
  mocha.before(async () => {
    console.log('Register 3 new user and sign 1 in (sets auth cookie)');
    let res = await request(app).post('/api/v1/register')
      .send({ email: `${id1}@test.com`, password: 'password', firstName: 'Hermes', lastName: 'Check' });
    assert.isNotNull(res.body);
    userId1 = res.body;

    res = await request(app).post('/api/v1/register')
      .send({ email: `${id2}@test.com`, password: 'password', firstName: 'Appolos', lastName: 'Check' });
    assert.isNotNull(res.body);
    userId2 = res.body;

    res = await request(app).post('/api/v1/register')
      .send({ email: `${id3}@test.com`, password: 'password', firstName: 'Ares', lastName: 'Check' });
    assert.isNotNull(res.body);
    userId3 = res.body;

    res = await agent.post('/auth/local')
      .send({ username: `${id1}@test.com`, password: 'password' });
    assert.equal(res.status, 200);
  });

  mocha.it('Should create a new 1 on 1 conversation and send a message to it', async () => {
    const res = await agent.post('/api/v1/conversations')
    .send({
      userIds: [userId2],
      isOneOnOne: true,
    });

    assert.equal(res.status, 201);
    assert.isNotNull(res.body.conversationId);

    const sendMessageResponse = await agent.post('/api/v1/messages')
    .send({
      conversationId: res.body.conversationId,
      content: 'Some juciy content',
    });

    assert.equal(sendMessageResponse.status, 201);
    assert.isNotNull(sendMessageResponse.body.messageId);

    const getConversationResponse = await agent.get(`/api/v1/conversations/${res.body.conversationId}`);

    assert.equal(getConversationResponse.status, 200);
    assert.equal(getConversationResponse.body.messages.length, 1);

    const recreateConversationResponse = await agent.post('/api/v1/conversations')
    .send({
      userIds: [userId2],
      isOneOnOne: true,
    });

    assert.equal(recreateConversationResponse.status, 500);
  });

  mocha.it('Should create a new group conversation and fetch the user\'s conversations', async () => {
    const res = await agent.post('/api/v1/conversations')
    .send({
      userIds: [userId2, userId3],
      isOneOnOne: false,
    });

    assert.equal(res.status, 201);
    assert.isNotNull(res.body.conversationId);

    const getConversationsResponse = await agent.get('/api/v1/conversations');

    assert.equal(getConversationsResponse.status, 200);
    assert.isTrue(getConversationsResponse.body.length > 0);
  });

  mocha.it('Should create a conversation delete the conversation', async () => {
    const res = await agent.post('/api/v1/conversations')
    .send({
      userIds: [userId2, userId3],
      isOneOnOne: false,
    });

    assert.equal(res.status, 201);
    assert.isNotNull(res.body.conversationId);

    const deleteConversationResponse = await agent.delete(`/api/v1/conversations/${res.body.conversationId}`);

    assert.equal(deleteConversationResponse.status, 204);

    const getConversationResponse = await agent.get(`/api/v1/conversations/${res.body.conversationId}`);

    assert.equal(getConversationResponse.status, 200);
    assert.isTrue(getConversationResponse.body.isDeleted);
  });
});
