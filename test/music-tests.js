const chai = require('chai');
const mocha = require('mocha');
const request = require('supertest');
const app = require('../lib/src/server/server');
const uuidV4 = require('uuid/v4');
const fs = require('fs');

const assert = chai.assert;

mocha.describe('Music API tests', () => {
  const agent = request.agent(app);
  let userId;
  const id = uuidV4();
  mocha.before(async () => {
    console.log('Register new user and sign in (sets auth cookie)');
    let res = await agent.post('/api/v1/register')
      .send({ email: `${id}@test.com`, password: 'password', firstName: 'Mic', lastName: 'Check' });
    assert.isNotNull(res.body);
    userId = res.body;
    res = await agent.post('/auth/local')
      .send({ username: `${id}@test.com`, password: 'password' });
    assert.equal(res.status, 200);
  });
/*
  mocha.it('Should upload recording and update it', async () => {
    const file = fs.readFileSync('./test/test-audio.aac');
    const res = await agent.post('/api/v1/recordings')
      .field('duration', '2s')
      .field('name', 'testing.aac')
      .field('size', '14kb')
      .field('extension', '.aac')
      .field('file', new Buffer(file).toString('base64'));

    assert.equal(res.status, 201);
    assert.equal(res.body.name, 'testing.aac');

    const getMusicResponse = await agent.get(`/api/v1/recordings/${res.body.id}`);
    assert.equal(res.body.id, getMusicResponse.body.id);

    const updateMusicResponse = await agent.patch(`/api/v1/recordings/${res.body.id}`)
      .send({
        name: 'changed.aac',
        description: 'THIS SICK BEAT',
      });

    assert.equal(updateMusicResponse.body.name, 'changed.aac');
    assert.equal(updateMusicResponse.body.description, 'THIS SICK BEAT');
  }).timeout(10000);

  mocha.it('Should get user\'s recordings', async () => {
    const file = fs.readFileSync('./test/test-audio.aac');
    const res = await agent.post('/api/v1/recordings')
      .field('duration', '2s')
      .field('name', 'user.aac')
      .field('size', '14kb')
      .field('extension', '.aac')
      .field('file', new Buffer(file).toString('base64'));

    assert.equal(res.status, 201);
    assert.equal(res.body.name, 'user.aac');

    const getMusicForUserResponse = await agent.get('/api/v1/recordings');
    assert.isArray(getMusicForUserResponse.body);
    assert.isTrue(getMusicForUserResponse.body.length > 0);
    assert.isNotNull(getMusicForUserResponse.body.find(m => m.name === 'user.aac'));
  }).timeout(10000);

  mocha.it('Should delete the recording', async () => {
    const file = fs.readFileSync('./test/test-audio.aac');
    const res = await agent.post('/api/v1/recordings')
      .field('duration', '2s')
      .field('name', 'deleteme.aac')
      .field('size', '14kb')
      .field('extension', '.aac')
      .field('file', new Buffer(file).toString('base64'));

    assert.equal(res.status, 201);

    const deleteMusicResponse = await agent.delete(`/api/v1/recordings/${res.body.id}`);

    assert.equal(deleteMusicResponse.status, 204);

    const getMusicResponse = await agent.get(`/api/v1/recordings/${res.body.id}`);
    assert.equal(res.body.id, getMusicResponse.body.id);
    assert.isTrue(getMusicResponse.body.isDeleted);
  }).timeout(10000);
*/
  mocha.it('Should create a recording with tags and update it', async () => {
    const file = fs.readFileSync('./test/test-audio.aac');
    const res = await agent.post('/api/v1/recordings')
      .field('duration', '2s')
      .field('name', 'tagged.aac')
      .field('size', '14kb')
      .field('extension', '.aac')
      .field('tags', ['music', 'metal'])
      .field('file', new Buffer(file).toString('base64'));

    assert.equal(res.status, 201);

    const getMusicResponse = await agent.get(`/api/v1/recordings/${res.body.id}`);
    assert.equal(res.body.id, getMusicResponse.body.id);
    assert.equal(res.body.tags.length, 2);

    /*const updateMusicResponse = await agent.patch(`/api/v1/recordings/${res.body.id}`)
      .send({
        name: 'changed.aac',
        description: 'THIS SICK BEAT',
      });

    assert.equal(updateMusicResponse.body.name, 'changed.aac');
    assert.equal(updateMusicResponse.body.description, 'THIS SICK BEAT');*/
  }).timeout(10000);
});
