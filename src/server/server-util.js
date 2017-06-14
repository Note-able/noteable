import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import request from 'request';
import passport from 'passport';
import mysql from 'mysql2/promise';

export function connectToDb(connectionString, callback) {
  pg.connect(connectionString, (err, client, done) => {
    let error;
    if (err){
      error = err;
    }
    console.log(error);
    const connection = err ? { status: 'ERROR', error } : { status: 'SUCCESS', client, done };
    if (callback) {
      callback(connection);
      return null;
    }
    return connection;
  });
}

export function connectToMysqlDb(connectionParameters) {
  return mysql.createConnection(connectionParameters);
}

export function ensureAuthenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
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

export function validatePassword(password, userPassword) {
  return bcrypt.compareSync(password, userPassword);
}

export function generateToken(user) {
  return jwt.sign(user, 'theAssyrianCameDownLikeAWolfOnTheFold', null);
}

const providers = {
  facebook: {
    url: 'https://graph.facebook.com/me',
  },
};

export function validateWithProvider(network, socialToken) {
  return new Promise((resolve, reject) => {
  // Send a GET request to Facebook with the token as query string
    request({
      url: providers[network].url,
      qs: { access_token: socialToken },
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(JSON.parse(body));
      } else {
        reject(error);
      }
    });
  });
}
