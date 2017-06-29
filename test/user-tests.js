const chai = require('chai');
const mocha = require('mocha');
const request = require('supertest');
const app = require('../lib/src/server/server');
const uuidV4 = require('uuid/v4');
const Browser = require('zombie');

Browser.localhost('local.noteable.me', 8080);
const assert = chai.assert;

mocha.describe('User API tests using cookie', () => {
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

  mocha.it('Should update profile', async () => {
    const res = await agent.post(`/api/v1/users/${userId}/profile`)
    .send({ bio: 'test bio', zipCode: 98225, firstName: 'Uncle', lastName: 'Drew', profession: 'baller', instruments: [1, 2], preferences: { isLooking: true } });

    assert.equal(res.status, 201);
  });

  mocha.it('Should get the user\'s profile', async () => {
    const res = await agent.get(`/api/v1/users/${userId}`);

    assert.isNotNull(res.body);
    assert.equal(res.body.profession, 'baller');
  });
});

mocha.describe('User API tests using JWT', () => {
  let userId;
  let jwt;
  const id = uuidV4();
  mocha.before(async () => {
    console.log('Register new user and sign in (gets jwt)');
    let res = await request(app).post('/api/v1/register')
      .send({ email: `${id}@test.com`, password: 'password', firstName: 'Uncle', lastName: 'Drew' })
    assert.isNotNull(res.body);
    userId = res.body;
    res = await request(app).post('/auth/local/jwt')
      .send({ username: `${id}@test.com`, password: 'password' });
    assert.equal(res.status, 200);
    jwt = res.body.token;
  });

  mocha.it('Should update profile', async () => {
    const res = await request(app)
      .post(`/api/v1/users/${userId}/profile`)
      .send({ bio: 'test bio', zipCode: 98225, firstName: 'Uncle', lastName: 'Drew', profession: 'baller', instruments: [1, 2], preferences: { isLooking: true } })
      .set({ Authorization: jwt });

    assert.equal(res.status, 201);
  });

  mocha.it('Should get the user\'s profile', async () => {
    const res = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set({ Authorization: jwt });

    assert.isNotNull(res.body);
    assert.equal(res.body.profession, 'baller');
  });
});

/* WIP... use zombie to test facebook login flow
mocha.describe('User API tests using Facebook auth', function () {
  this.timeout(20000);
  const agent = request.agent(app);
  mocha.before(async () => {
    console.log('Login using facebook. Registers account if not exists');
    const browser = new Browser({ debug: true });
    browser.userAgent = [
      "Mozilla/5.0 (Windows NT 6.1)",
      "AppleWebKit/537.36 (KHTML, like Gecko)",
      "Chrome/41.0.2228.0 Safari/537.36"
    ].join(" ");
    await browser.visit('/auth/facebook').then(() => {
      console.log('login' + browser.location.pathname);
      return browser.fill('email', 'ferfwamuqn_1498628679@tfbnw.net')
      .fill('pass', 'noteable')
      .pressButton('login');
    }).then(() => {
      console.log('conf' + browser.location.pathname);
      return browser.wait(1000).pressButton('Continue as Richard');
    }).then(() => {
      console.log(browser.location.pathname);
    });
    console.log('Finished browser login');
  });

  mocha.it('Should update profile', async () => {
    const res = await agent.post(`/api/v1/users/${userId}/profile`)
    .send({ bio: 'test bio', zipCode: 98225, firstName: 'Uncle', lastName: 'Drew', profession: 'baller', instruments: [1, 2], preferences: { isLooking: true } });

    assert.equal(res.status, 201);
  });

  mocha.it('Should get the user\'s profile', async () => {
    const res = await agent.get(`/api/v1/users/${userId}`);

    assert.isNotNull(res.body);
    assert.equal(res.body.profession, 'baller');
  });
});
*/
