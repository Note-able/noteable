import express from 'express';
import https from 'https';
import BodyParser from 'body-parser';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import LocalStrategy from 'passport-local';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import session from 'express-session';
import Formidable from 'formidable';
import fs from 'fs';
import { UserService } from './services';
import { ensureAuthenticated, validatePassword, generateToken, validateWithProvider, connectToMysqlDb } from './server-util';
import config from '../config';

const MongoStore = require('connect-mongo')(session);

const env = process.env.NODE_ENV;
console.log(env);
console.log(process.env.TESTING);
global.DEBUG = env !== 'production' && env !== 'internal';
global.PRODUCTION = env === 'production';
global.CLIENT = false;

const app = express();
app.use(express.static(`${__dirname}/../../public`));

const userService = new UserService({ auth: ensureAuthenticated, database: config.connectionString });

// set up Jade
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());

app.set('views', './views');
app.set('view engine', 'jade');
app.use(session({
  secret: 'theAssyrianCameDownLikeAWolfOnTheFold',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://mongo:27017/',
  }),
}));
app.use(passport.initialize());
app.use(passport.session());

/* Passport Configuration */

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});


passport.use(new LocalStrategy({ callbackURL: '/auth/local/callback' }, async (username, password, done) => {
  const connection = await connectToMysqlDb(config.mysqlConnection);
  let user = null;
  console.log('trying to auth');
  const [rows] = await connection.query(`
    SELECT pr.id, p.password, pr.email
    FROM users p
    INNER JOIN profiles pr
    ON p.id = pr.user_id WHERE pr.email = ?;`,
    [username]);

  connection.destroy();

  user = rows[0];
  if (!user) {
    return done(null, false);
  }

  if (validatePassword(password, user.password)) {
    return done(null, user);
  }

  return done(null, false);
}));

// set up passport
passport.use(new FacebookStrategy({
  clientID: '1668133090067160',
  clientSecret: '3e4ad4e3d0d1f5602797b46753be7e01',
  callbackURL: '/auth/facebook/callback',
  enableProof: false,
},
  async (accessToken, refreshToken, profile, done) => {
    const connection = await connectToMysqlDb(config.mysqlConnection);
    let user = null;
    console.log('trying to fb auth');
    const [rows] = await connection.query(`
      SELECT *
      FROM users p
      WHERE facebook_id = ?;`,
      [profile.id]);

    connection.destroy();

    user = rows[0];
    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  },
));

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: 'theAssyrianCameDownLikeAWolfOnTheFold',
};

passport.use(new JwtStrategy(jwtOptions, async (profile, done) => {
  const connection = await connectToMysqlDb(config.mysqlConnection);
  let user = null;
  console.log('trying to fb auth');
  const [rows] = await connection.query(`
    SELECT *
    FROM users p
    WHERE facebook_id = ?;`,
    [profile.facebook_id]);

  connection.destroy();

  user = rows[0];
  if (!user) {
    return done(null, false);
  }

  return done(null, user);
}));

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.post('/auth/local',
  passport.authenticate('local'),
  (req, res) => {
    res.status(200).send();
  });

app.post('/auth/jwt',
  (req, res) => {
    validateWithProvider('facebook', req.body.token)
      .then(async (profile) => {
        const connection = await connectToMysqlDb(config.mysqlConnection);
        let user = null;
        console.log('trying to fb auth');
        const [rows] = await connection.query(`
          SELECT *
          FROM users p
          WHERE facebook_id = ?;`,
          [profile.id]);

        connection.destroy();

        user = rows[0];
        if (!user) {
          return res.status(404).send();
        }

        return res.status(200).json({
          token: `JWT ${generateToken(user)}`,
          user,
        });
      });
  });

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });


app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/test');
});

/* Import API Routes */
require('./api-routes')(app, {
  auth: ensureAuthenticated,
  database: config.connectionString,
  connectToMysqlDb: connectToMysqlDb,
  mysqlParameters: config.mysqlConnection,
});

/* Normal Routes */
app.get('/*', (req, res) => {
  userService.getUser(req.user ? req.user.id : null).then((user) => {
    res.render('index', {
      props: encodeURIComponent(JSON.stringify(
        {
          isAuthenticated: user == null,
          profile: user,
        },
      )),
      env: global.PRODUCTION ? 'production' : 'dev',
    });
  });
});

if (fs.existsSync('./src/server/keys/server.key') && process.env.TESTING !== 'true') {
  const options = {
    key: fs.readFileSync('./src/server/keys/server.key'),
    cert: fs.readFileSync('./src/server/keys/server.crt'),
    requestCert: false,
    rejectUnauthorized: false,
  };

  const httpsServer = https.createServer(options, app).listen(443, () => {
    const host = httpsServer.address().address;
    const port = httpsServer.address().port;

    console.log('JamSesh is listening at https://%s:%s', host, port);
  });

  require('./sockets')(httpsServer, { auth: ensureAuthenticated, database: config.connectionString });
}

const httpServer = app.listen(config.port, () => {
  const host = httpServer.address().address;
  const port = httpServer.address().port;

  console.log('JamSesh is listening at http://%s:%s', host, port);
});

require('./sockets')(httpServer, { auth: ensureAuthenticated, database: config.connectionString });

module.exports = app;
