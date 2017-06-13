const chai = require('chai');
const mocha = require('mocha');
const request = require('supertest');
const app = require('../lib/src/server/server');
const uuidV4 = require('uuid/v4');

const assert = chai.assert;

mocha.describe('User API tests', () => {
  const agent = request.agent(app);

  mocha.it('Should register a new user', (done) => {
    const id = uuidV4();
    agent.post('/api/v1/register')
      .send({ email: `${id}@test.com`, password: 'password', firstName: 'Uncle', lastName: 'Drew' })
      .expect('set-cookie')
      .end((err, res) => {
        assert.isNotNull(res.body);
        assert.isNotNull(res.body.id);
        done();
      });
  });
});
