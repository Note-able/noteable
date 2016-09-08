import bcrypt from 'bcrypt-nodejs';
import pg from 'pg';

export function connectToDb(connectionString, callback) {
  pg.connect(connectionString, (err, client, done) => {
    let error;
    if (err){
      error = err;
    }
    console.log(error);
    const connection = err ? { status : 'ERROR', error : error } : { status : 'SUCCESS', client : client, fin: done };
    if(callback){
      callback(connection);
      return null;
    }
    return connection;
  });
}

export function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated() || req.xhr || req.headers.accept.indexOf('json') > -1) {
    next();
    return;
  }

  res.redirect('/');
}

export function validatePassword(password, userPassword) {
  return bcrypt.compareSync(password, userPassword);
}
