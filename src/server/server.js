'use strict';

const express = require(`express`);
const pg = require(`pg`);
const BodyParser = require(`body-parser`);
const passport = require(`passport`);
const FacebookStrategy = require(`passport-facebook`);
const LocalStrategy = require('passport-local');
const session = require(`express-session`);
const Formidable = require(`formidable`);
const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');

const app = express()
app.use(express.static(`${__dirname}/../../public`));
const config = require('../config');
const audio = require('../util/gcloud-util')(config.gcloud, config.cloudAudioStorageBucket);
const image = require('../util/gcloud-util')(config.gcloud, config.cloudImageStorageBucket);

// set up Jade
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());

app.set(`views`, `./views`);
app.set(`view engine`, `jade`);
app.use(session({
  secret: `theAssyrianCameDownLikeAWolfOnTheFold`,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new LocalStrategy(
  { callbackURL: '/auth/local/callback'
}, (username, password, done) => {
  ConnectToDb(config.connectionString, (connection) => {
    if(connection.status === `SUCCESS`){
      let user = null;
      connection.client
      .query(`SELECT * FROM public.user WHERE email = '${username}';`)
      .on(`row`, (row) => {
        user = row;
        connection.fin();
        if (!user){
          return done(null, false);
        }

        if(validatePassword(password, user.password)){
          return done(null, user);
        }

        return done(null, false);
      }).on('end', () => {
        if (user === null) {
          return done(null, false);
        }
      });
    }
  });
}));

//set up passport
passport.use(new FacebookStrategy({
  clientID: `1668133090067160`,
  clientSecret: `3e4ad4e3d0d1f5602797b46753be7e01`,
  callbackURL: `/auth/facebook/callback`,
  enableProof: false
},
  (accessToken, refreshToken, profile, done) => {
    ConnectToDb(config.connectionString, (connection) => {
      if(connection.status === `SUCCESS`){
        let user;
        console.log(profile.id);
        connection.client
        .query(`SELECT * FROM public.user WHERE facebook_id = '${profile.id}';`)
        .on(`row`, (row) => {
          user = row;
          connection.fin();
          return done(null, user);
        })
        .on('end', () => {
          if (user === null) {
            return done(null, false);
          }
        });
      }
    });
  }
));

app.get(`/auth/facebook`,
  passport.authenticate(`facebook`));

app.get('/auth/local',
  passport.authenticate('local'),
  (req, res) => {
    res.redirect('/');
  });

app.get(`/auth/facebook/callback`,
  passport.authenticate(`facebook`, { failureRedirect: `/login` }),
  (req, res) => {
    res.redirect(`/`);
  });

app.get(`/test`, ensureAuthenticated, (req, res) => {
  res.render(`index`);
});

require(`./api-routes`)(app, {auth: ensureAuthenticated, connect: ConnectToDb, database: config.connectionString});

app.get(`/logout`, (req, res) => {
  req.logout();
  res.redirect(`/test`);
});

app.get('/me', ensureAuthenticated, (req, res) => {
  res.redirect(`/user/${req.user.id}`);
  //track here
});

app.post('/post-blob', (req, res) => {
  const form = new Formidable.IncomingForm();
  form.uploadDir = '/uploads';

  form.onPart = function (part) {
    form.handlePart(part);
  }

  form.parse(req, (err, fields) => {
    const buffer = new Buffer(fields.file, 'base64');
    fs.writeFileSync(fields.name, buffer);
    audio.sendUploadToGCS(`${ fields.name }.wav`, buffer, response => {
      if (response.error) {
        console.log(response.error);
        return;
      }
    });
  });

  res.status(200).send();
});

app.post( '/add-image', ensureAuthenticated, (req, res) => {
  const form = new Formidable.IncomingForm();
  form.uploadDir = '/uploads';

  form.onPart = function (part) {
    form.handlePart(part);
  }

  form.parse(req, (err, fields) => {
    const buffer = new Buffer(fields.file, 'base64');

    image.sendUploadToGCS(`${fields.name}`, buffer, (response) => {
      if (response && response.error) {
        console.log(response.error);
        return null;
      }

      console.log(response.cloudStoragePublicUrl);
      res.status(200).send(response);
    });
  });
});

app.get('/*', (req, res) => {
  res.render(`index`, {props: JSON.stringify(
    {
      isAuthenticated: req.isAuthenticated(),
      userId: req.user ? req.user.id : -1
    }
  )});
});

app.get('/editor', ensureAuthenticated, (req, res) => {
  res.render('index');
});

const server = app.listen(config.port, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`JamSesh is listening at http://%s:%s`, host, port);
});

require('./sockets')(server, {auth: ensureAuthenticated, connect: ConnectToDb, database: config.connectionString});

function ConnectToDb (connectionString, callback){
  pg.connect(connectionString, (err, client, done) => {
    let error;
    if (err){
      error = err;
    }
    console.log(error);
    const connection = err ? { status : `ERROR`, error : error } : { status : `SUCCESS`, client : client, fin: done };
    if(callback){
      callback(connection);
      return null;
    }
    return connection;
  });
}

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    next()
    return;
  }
  res.redirect(`/`)
}

function validatePassword(password, userPassword) {
  return bcrypt.compareSync(password, userPassword);
}

