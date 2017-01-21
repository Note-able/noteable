import express from 'express';
import BodyParser from 'body-parser';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import LocalStrategy from 'passport-local';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import session from 'express-session';
import Formidable from 'formidable';
import { UserService } from './services';
import fs from 'fs';
import { connectToDb, ensureAuthenticated, validatePassword, generateToken, validateWithProvider } from './server-util';

const MongoStore = require('connect-mongo')(session);

const env = process.env.NODE_ENV;
global.DEBUG = env !== 'production' && env !== 'internal';
global.PRODUCTION = env === 'production';
global.CLIENT = false;

const app = express();
app.use(express.static(`${__dirname}/../../public`));
const config = require('../config');
const audio = require('../util/gcloud-util')(config.gcloud, config.cloudAudioStorageBucket);
const image = require('../util/gcloud-util')(config.gcloud, config.cloudImageStorageBucket);
const m_userService = new UserService({ auth: ensureAuthenticated, connect: connectToDb, database: config.connectionString });

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

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});


passport.use(new LocalStrategy({ callbackURL: '/auth/local/callback' }, (username, password, done) => {
  connectToDb(config.connectionString, (connection) => {
    if (connection.status === 'SUCCESS') {
      let user = null;
      connection.client
      .query(`SELECT * FROM public.user WHERE email = '${username}';`)
      .on('row', (row) => {
        user = row;
        connection.done();
        if (!user) {
          return done(null, false);
        }

        if (validatePassword(password, user.password)) {
          return done(null, user);
        }

        return done(null, false);
      }).on('end', () => {
        if (user === null) {
          return done(null, false);
        }

        return null;
      });
    }
  });
}));

// set up passport
passport.use(new FacebookStrategy({
  clientID: '1668133090067160',
  clientSecret: '3e4ad4e3d0d1f5602797b46753be7e01',
  callbackURL: '/auth/facebook/callback',
  enableProof: false,
},
  (accessToken, refreshToken, profile, done) => {
    connectToDb(config.connectionString, (connection) => {
      if (connection.status === 'SUCCESS') {
        let user;
        connection.client
        .query(`SELECT * FROM public.user WHERE facebook_id = '${profile.id}';`)
        .on('row', (row) => {
          user = row;
          connection.done();
          return done(null, user);
        })
        .on('end', () => {
          if (user === null) {
            return done(null, false);
          }

          return null;
        });
      }
    });
  }
));

const jwtOptions = {  
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: 'theAssyrianCameDownLikeAWolfOnTheFold',
};

passport.use(new JwtStrategy(jwtOptions, (profile, done) => {
  console.log(profile);
  connectToDb(config.connectionString, (connection) => {
    if (connection.status === 'SUCCESS') {
      let user;
      connection.client
      .query(`SELECT * FROM public.user WHERE facebook_id = '${profile.facebook_id}';`)
      .on('row', (row) => {
        user = row;
        connection.done();
        return done(null, user);
      })
      .on('end', () => {
        if (user === null) {
          return done(null, false);
        }

        return null;
      });
    }
  })
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
      .then((profile) => {
        connectToDb(config.connectionString, (connection) => {
          if (connection.status === 'SUCCESS') {
            let user;
            connection.client
            .query(`SELECT * FROM public.user WHERE facebook_id = '${profile.id}';`)
            .on('row', (row) => {
              user = row;
              connection.done();
              return res.status(200).json({
                token: `JWT ${generateToken(user)}`,
                user: user,
              })
            })
            .on('end', () => {
              return res.status(404).send();
            });
          }
        });
      });
  });

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

app.get('/test', ensureAuthenticated, (req, res) => {
  res.render('index');
});

require('./api-routes')(app, { auth: ensureAuthenticated, connect: connectToDb, database: config.connectionString });

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/test');
});

app.get('/me', (req, res) => {
  res.redirect(`/user/${req.user == null ? -1 : req.user.id}`);
  // track here
});

app.post('/post-blob', (req, res) => {
  const form = new Formidable.IncomingForm();
  form.uploadDir = '/uploads';

  form.onPart = part => {
    form.handlePart(part);
  };

  form.parse(req, (err, fields) => {
    const buffer = new Buffer(fields.file, 'base64');
    fs.writeFileSync(fields.name, buffer);
    audio.sendUploadToGCS(`${fields.name}.wav`, buffer, response => {
      if (response.error) {
        console.log(response.error);
        return;
      }
    });
  });

  res.status(200).send();
});

app.post('/add-image', ensureAuthenticated, (req, res) => {
  const form = new Formidable.IncomingForm();
  form.uploadDir = '/uploads';

  form.onPart = part => {
    form.handlePart(part);
  };

  form.parse(req, (err, fields) => {
    const buffer = new Buffer(fields.file, 'base64');

    image.sendUploadToGCS(`${fields.name}`, buffer, response => {
      if (response && response.error) {
        res.status(500).send();
      }

      console.log(response.cloudStoragePublicUrl);
      res.status(200).send(response);
    });
  });
});

app.get('/*', (req, res) => {
  m_userService.getUser(req.user ? req.user.id : null, user => {
    res.render('index', {
      props: encodeURIComponent(JSON.stringify(
        {
          isAuthenticated: user == null,
          profile: user,
        }
      )),
      env: global.PRODUCTION ? 'production' : 'dev',
    });
  });
});

const server = app.listen(config.port, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('JamSesh is listening at http://%s:%s', host, port);
});

require('./sockets')(server, { auth: ensureAuthenticated, connect: connectToDb, database: config.connectionString });