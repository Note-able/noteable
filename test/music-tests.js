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
      .send({ email: `${id}@test.com`, password: 'password', firstName: 'Uncle', lastName: 'Drew' })
    assert.isNotNull(res.body);
    userId = res.body;
    res = await agent.post('/auth/local')
      .send({ username: `${id}@test.com`, password: 'password' });
    assert.equal(res.status, 200);
  });

  mocha.it('Should upload recordings', async () => {
    const file = fs.readFileSync('./test/test-audio.aac');
    const res = await agent.post('/api/v1/recordings')
      .field('duration', '2s')
      .field('name', 'testing.aac')
      .field('size', '14kb')
      .field('extension', '.aac')
      .field('file', new Buffer(file).toString('base64'));

    assert.equal(res.status, 201);
    assert.equal(res.body.name, 'testing.aac');
  });
});
