'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportFacebook = require('passport-facebook');

var _passportFacebook2 = _interopRequireDefault(_passportFacebook);

var _passportLocal = require('passport-local');

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _formidable = require('formidable');

var _formidable2 = _interopRequireDefault(_formidable);

var _services = require('./services');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _serverUtil = require('./server-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MongoStore = require('connect-mongo')(_expressSession2.default);

var env = 'production'; // process.env.NODE_ENV;
global.DEBUG = env !== 'production' && env !== 'internal';
global.PRODUCTION = env === 'production';
global.CLIENT = false;

var app = (0, _express2.default)();
app.use(_express2.default.static(__dirname + '/../../public'));
var config = require('../config');
var audio = require('../util/gcloud-util')(config.gcloud, config.cloudAudioStorageBucket);
var image = require('../util/gcloud-util')(config.gcloud, config.cloudImageStorageBucket);
var m_userService = new _services.UserService({ auth: _serverUtil.ensureAuthenticated, connect: _serverUtil.connectToDb, database: config.connectionString });

// set up Jade
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.set('views', './views');
app.set('view engine', 'jade');
app.use((0, _expressSession2.default)({
  secret: 'theAssyrianCameDownLikeAWolfOnTheFold',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://mongo:27017/'
  })
}));
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

_passport2.default.serializeUser(function (user, done) {
  done(null, user);
});

_passport2.default.deserializeUser(function (obj, done) {
  done(null, obj);
});

_passport2.default.use(new _passportLocal2.default({ callbackURL: '/auth/local/callback' }, function (username, password, done) {
  (0, _serverUtil.connectToDb)(config.connectionString, function (connection) {
    if (connection.status === 'SUCCESS') {
      (function () {
        var user = null;
        connection.client.query('SELECT * FROM public.user WHERE email = \'' + username + '\';').on('row', function (row) {
          user = row;
          connection.fin();
          if (!user) {
            return done(null, false);
          }

          if ((0, _serverUtil.validatePassword)(password, user.password)) {
            return done(null, user);
          }

          return done(null, false);
        }).on('end', function () {
          if (user === null) {
            return done(null, false);
          }

          return null;
        });
      })();
    }
  });
}));

// set up passport
_passport2.default.use(new _passportFacebook2.default({
  clientID: '1668133090067160',
  clientSecret: '3e4ad4e3d0d1f5602797b46753be7e01',
  callbackURL: '/auth/facebook/callback',
  enableProof: false
}, function (accessToken, refreshToken, profile, done) {
  (0, _serverUtil.connectToDb)(config.connectionString, function (connection) {
    if (connection.status === 'SUCCESS') {
      (function () {
        var user = void 0;
        connection.client.query('SELECT * FROM public.user WHERE facebook_id = \'' + profile.id + '\';').on('row', function (row) {
          user = row;
          connection.fin();
          return done(null, user);
        }).on('end', function () {
          if (user === null) {
            return done(null, false);
          }

          return null;
        });
      })();
    }
  });
}));

app.get('/auth/facebook', _passport2.default.authenticate('facebook'));

app.post('/auth/local', _passport2.default.authenticate('local'), function (req, res) {
  res.status(200).send();
});

app.get('/auth/facebook/callback', _passport2.default.authenticate('facebook', { failureRedirect: '/login' }), function (req, res) {
  res.redirect('/');
});

app.get('/test', _serverUtil.ensureAuthenticated, function (req, res) {
  res.render('index');
});

require('./api-routes')(app, { auth: _serverUtil.ensureAuthenticated, connect: _serverUtil.connectToDb, database: config.connectionString });

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/test');
});

app.get('/me', function (req, res) {
  res.redirect('/user/' + (req.user == null ? -1 : req.user.id));
  // track here
});

app.post('/post-blob', function (req, res) {
  var form = new _formidable2.default.IncomingForm();
  form.uploadDir = '/uploads';

  form.onPart = function (part) {
    form.handlePart(part);
  };

  form.parse(req, function (err, fields) {
    var buffer = new Buffer(fields.file, 'base64');
    _fs2.default.writeFileSync(fields.name, buffer);
    audio.sendUploadToGCS(fields.name + '.wav', buffer, function (response) {
      if (response.error) {
        console.log(response.error);
        return;
      }
    });
  });

  res.status(200).send();
});

app.post('/add-image', _serverUtil.ensureAuthenticated, function (req, res) {
  var form = new _formidable2.default.IncomingForm();
  form.uploadDir = '/uploads';

  form.onPart = function (part) {
    form.handlePart(part);
  };

  form.parse(req, function (err, fields) {
    var buffer = new Buffer(fields.file, 'base64');

    image.sendUploadToGCS('' + fields.name, buffer, function (response) {
      if (response && response.error) {
        res.status(500).send();
      }

      console.log(response.cloudStoragePublicUrl);
      res.status(200).send(response);
    });
  });
});

app.get('/*', function (req, res) {
  console.log(global.PRODUCTION);
  m_userService.getUser(req.user ? req.user.id : null, function (user) {
    res.render('index', {
      props: encodeURIComponent(JSON.stringify({
        isAuthenticated: user == null,
        profile: user
      })),
      env: global.PRODUCTION ? 'production' : 'dev'
    });
  });
});

var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('JamSesh is listening at http://%s:%s', host, port);
});

require('./sockets')(server, { auth: _serverUtil.ensureAuthenticated, connect: _serverUtil.connectToDb, database: config.connectionString });