'use strict';

const express = require(`express`);
const pg = require(`pg`);
const BodyParser = require(`body-parser`);
const passport = require(`passport`);
const FacebookStrategy = require(`passport-facebook`);
const session = require(`express-session`);
const Formidable = require(`formidable`);
const fs = require('fs');

const app = express();
app.use(express.static(`${__dirname}/../../public`));
const connectionString = process.env.DATABASE_URL || `postgres://bxujcozubyosgb:m1rgVoS1lEpdCZVRos6uWZVouU@ec2-54-235-146-58.compute-1.amazonaws.com:5432/d42dnjskegivlt?ssl=true`;
const port = process.env.PORT || 8080;

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

//set up passport
passport.use(new FacebookStrategy({
  clientID: `1668133090067160`,
  clientSecret: `3e4ad4e3d0d1f5602797b46753be7e01`,
  callbackURL: `http://local.jamsesh.com:3000/auth/facebook/callback`,
  enableProof: false
},
  (accessToken, refreshToken, profile, done) => {
    ConnectToDb(connectionString, (connection) => {
      if(connection.status === `SUCCESS`){
        let user;
        connection.client
        .query(`SELECT * FROM public.user WHERE facebook_id = '${profile.id}';`)
        .on(`row`, (row) => {
          user = row;
          connection.fin();
          if (!user){
            return done(null, false);
          }

          return done(null, user);
        });
      }
    });
  }
));

app.get(`/auth/facebook`,
  passport.authenticate(`facebook`));

app.get(`/auth/facebook/callback`,
  passport.authenticate(`facebook`, { failureRedirect: `/login` }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect(`/user/me`);
  });

app.get(`/test`, ensureAuthenticated, (req, res) => {
  res.render(`index`);
});

require(`./api-routes`)(app, pg, {auth: ensureAuthenticated, connect: ConnectToDb, database: connectionString});

app.get(`/logout`, (req, res) => {
  req.logout();
  res.redirect(`/test`);
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
  });

  res.status(200).send();
});

app.get('/*', (req, res) => {
  res.render(`index`, {props : req.isAuthenticated().toString()});
});

app.get('/editor', (req, res) => {
  res.render(`index`, {props : req.isAuthenticated().toString()});
});

const server = app.listen(port, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`JamSesh is listening at http://%s:%s`, host, port);
});

require('./sockets')(server);

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
