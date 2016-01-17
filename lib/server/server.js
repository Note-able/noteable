var express = require('express');
var path = require('path');
var pg = require('pg');
var React = require('react');
var Router = require('react-router');
var BodyParser = require('body-parser');
var routes = require('../routes');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var session = require('express-session');

const app = express();
app.use(express.static(__dirname + '/../../public'));
const connectionString = process.env.DATABASE_URL || 'postgres://bxujcozubyosgb:m1rgVoS1lEpdCZVRos6uWZVouU@ec2-54-235-146-58.compute-1.amazonaws.com:5432/d42dnjskegivlt?ssl=true';
const port = process.env.PORT || 3000;

// set up Jade
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());

app.set('views', './views');
app.set('view engine', 'jade');
app.use(session({
  secret: 'theAssyrianCameDownLikeAWolfOnTheFold',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

const users = [10156402243690621];

//set up passport
passport.use(new FacebookStrategy({
  clientID: '1668133090067160',
  clientSecret: '3e4ad4e3d0d1f5602797b46753be7e01',
  callbackURL: "http://local.jamsesh.com:3000/auth/facebook/callback",
  enableProof: false
}, function (accessToken, refreshToken, profile, done) {
  /**User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return done(err, user);
  });**/
  console.log(profile);
  return done(null, profile);
}));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function (req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});

app.get('/test', ensureAuthenticated, function (req, res) {
  res.render('index');
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/test');
});

app.get('/*', function (req, res) {
  if (req.path.indexOf('/database') == -1) {
    res.render('index');
  }
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('JamSesh is listening at http://%s:%s', host, port);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/success');
  }
  res.redirect('/');
}