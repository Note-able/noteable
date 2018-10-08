import 'babel-polyfill';
import express from 'express';
import https from 'https';
import BodyParser from 'body-parser';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import LocalStrategy from 'passport-local';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import session from 'express-session';
import fs from 'fs';
import { UserService } from './services';
import { uploadPictureFromUrl } from './apis/user-api.js';
import {
  ensureAuthenticated,
  validatePassword,
  generateToken,
  validateWithProvider,
  connectToMysqlDb,
} from './server-util';
import config from '../config';

const MongoStore = require('connect-mongo')(session);

const env = process.env.NODE_ENV;
global.DEBUG = env !== 'production' && env !== 'internal';
global.PRODUCTION = env === 'production';
global.CLIENT = false;

const app = express();
app.use(express.static(`${__dirname}/../../public`));

const userService = new UserService({
  auth: ensureAuthenticated,
  connectToMysqlDb,
  mysqlParameters: config.mysqlConnection,
});

// set up Jade
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());

app.set('views', './views');
app.set('view engine', 'pug');
app.use(
  session({
    secret: 'theAssyrianCameDownLikeAWolfOnTheFold',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      url: 'mongodb://mongo:27017/',
    }),
  }),
);
app.use(passport.initialize());
app.use(passport.session());

/* Passport Configuration */

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new LocalStrategy({ callbackURL: '/auth/local/callback' }, async (username, password, done) => {
    const connection = await connectToMysqlDb(config.mysqlConnection);
    let user = null;
    const [rows] = await connection.query(
      `
    SELECT pr.id, p.password, pr.email
    FROM users p
    INNER JOIN profiles pr
    ON p.id = pr.user_id
    WHERE pr.email = ?;`,
      [username],
    );

    user = rows[0];
    if (!user) {
      return done(null, false);
    }

    if (validatePassword(password, user.password)) {
      return done(null, user);
    }

    return done(null, false);
  }),
);

// set up passport
passport.use(
  new FacebookStrategy(
    {
      clientID: '1668133090067160',
      clientSecret: '3e4ad4e3d0d1f5602797b46753be7e01',
      callbackURL: '/auth/facebook/callback',
      enableProof: false,
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await userService.getUserByFacebookId(profile.id);

      if (user.avatarUrl && user.avatarUrl.indexOf('scontent.xx.fbcdn.net)') !== -1) {
        try {
          const response = await uploadPictureFromUrl(user.avatarUrl);
          userService.updateProfile(
            {
              ...user,
              avatarUrl: response.cloudStoragePublicUrl,
            },
            user.userId,
          );
        } catch (error) {
          console.log(error);
        }
      }

      if (user.coverImage && user.coverImage.indexOf('scontent.xx.fbcdn.net)') !== -1) {
        try {
          const response = await uploadPictureFromUrl(user.coverImage);
          userService.updateProfile(
            {
              ...user,
              coverImage: response.cloudStoragePublicUrl,
            },
            user.userId,
          );
        } catch (error) {
          console.log(error);
        }
      }

      if (user.id === -1) {
        let firstName = profile.name.givenName;
        let lastName = profile.name.familyName;
        if (!firstName || !lastName) {
          const names = profile.displayName.split(' ');
          firstName = names.slice(0, names.length - 1).join(' ');
          lastName = names[names.length - 1];
        }

        const userId = await userService.registerUser(
          profile.email,
          '',
          firstName,
          lastName,
          profile.id,
        );
        user = await userService.getUser(userId);
      }

      if (!user || user.id === -1) {
        return done(null, false);
      }

      return done(null, user);
    },
  ),
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: 'theAssyrianCameDownLikeAWolfOnTheFold',
};

passport.use(
  new JwtStrategy(jwtOptions, async (profile, done) => {
    const connection = await connectToMysqlDb(config.mysqlConnection);
    let user = null;
    const [rows] = await connection.query(
      `
    SELECT *
    FROM users p
    WHERE facebook_id = ? OR id = ?;`,
      [profile.facebook_id, profile.id],
    );

    user = rows[0];
    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  }),
);

app.get('/auth/facebook', passport.authenticate('facebook'));

app.post('/auth/local', passport.authenticate('local'), (req, res) => {
  res.status(200).send();
});

app.post('/auth/local/jwt', async (req, res) => {
  const connection = await connectToMysqlDb(config.mysqlConnection);
  let user = null;

  const [rows] = await connection.query(
    `
      SELECT pr.id, p.password, pr.email
      FROM users p
      INNER JOIN profiles pr
      ON p.id = pr.user_id
      WHERE pr.email = ?;`,
    [req.body.username],
  );

  user = rows[0];
  if (user == null || user.password == null || user.password === 'NULL' || user.password.length === 0) {
    return res.status(404).send();
  }

  try {
    if (validatePassword(req.body.password, user.password)) {
      return res.status(200).json({
        token: `JWT ${generateToken(user)}`,
        user,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }

  return res.status(401).send();
});

app.post('/auth/facebook/jwt', (req, res) => {
  validateWithProvider('facebook', req.body.token).then(async (profile) => {
    const connection = await connectToMysqlDb(config.mysqlConnection);
    let facebookUser = null;

    const [rows] = await connection.query(
      `
          SELECT *
          FROM users p
          WHERE facebook_id = ?;`,
      [profile.id],
    );

    facebookUser = rows[0];
    if (!facebookUser) {
      let cover = null;
      let avatar = null;

      if (profile.cover) {
        cover = profile.cover.source;
        avatar = await uploadPictureFromUrl(cover);
      }

      if (profile.picture != null) {
        avatar = profile.picture.data.url;
        avatar = await uploadPictureFromUrl(avatar);
      }
    }

    return res.status(200).json({
      token: `JWT ${generateToken(facebookUser)}`,
      user: facebookUser,
    });
  });
});

app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  },
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/test');
});

/* Import API Routes */
require('./api-routes')(app, {
  auth: ensureAuthenticated,
  database: config.connectionString,
  connectToMysqlDb,
  mysqlParameters: config.mysqlConnection,
});

/* Normal Routes */
app.get('/*', (req, res) => {
  userService.getUser(req.user ? req.user.id : null).then((user) => {
    res.render('index', {
      props: encodeURIComponent(
        JSON.stringify({
          isAuthenticated: user == null,
          profile: user,
        }),
      ),
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

  require('./sockets')(httpsServer, {
    auth: ensureAuthenticated,
    database: config.connectionString,
  });
}

const httpServer = app.listen(config.port, () => {
  const host = httpServer.address().address;
  const port = httpServer.address().port;

  console.log('JamSesh is listening at http://%s:%s', host, port);
});

require('./sockets')(httpServer, {
  auth: ensureAuthenticated,
  database: config.connectionString,
});

module.exports = app;
