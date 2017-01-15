'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectToDb = connectToDb;
exports.ensureAuthenticated = ensureAuthenticated;
exports.validatePassword = validatePassword;
exports.generateToken = generateToken;
exports.validateWithProvider = validateWithProvider;

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function connectToDb(connectionString, callback) {
  _pg2.default.connect(connectionString, function (err, client, done) {
    var error = void 0;
    if (err) {
      error = err;
    }
    console.log(error);
    var connection = err ? { status: 'ERROR', error: error } : { status: 'SUCCESS', client: client, fin: done };
    if (callback) {
      callback(connection);
      return null;
    }
    return connection;
  });
}

function ensureAuthenticated(req, res, next) {
  _passport2.default.authenticate('jwt', { session: false }, function (err, user, info) {
    if (err || !user) {
      if (req.isAuthenticated()) {
        next();
        return;
      }

      return res.redirect('/');
    }
    req.user = user;
    return next();
  })(req, res, next);
}

function validatePassword(password, userPassword) {
  return _bcryptNodejs2.default.compareSync(password, userPassword);
}

function generateToken(user) {
  return _jsonwebtoken2.default.sign(user, 'theAssyrianCameDownLikeAWolfOnTheFold', null);
}

var providers = {
  facebook: {
    url: 'https://graph.facebook.com/me'
  }
};

function validateWithProvider(network, socialToken) {
  return new Promise(function (resolve, reject) {
    // Send a GET request to Facebook with the token as query string
    (0, _request2.default)({
      url: providers[network].url,
      qs: { access_token: socialToken }
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(err);
      }
    });
  });
}