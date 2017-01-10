'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectToDb = connectToDb;
exports.ensureAuthenticated = ensureAuthenticated;
exports.validatePassword = validatePassword;

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

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
  if (req.isAuthenticated()) {
    next();
    return;
  }

  res.redirect('/');
}

function validatePassword(password, userPassword) {
  return _bcryptNodejs2.default.compareSync(password, userPassword);
}