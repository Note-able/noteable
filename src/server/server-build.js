'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRouter = require('react-router');

var _reducers = require('../shared/reducers');

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _create = require('../shared/components/profile/create.jsx');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createBrowserHistory = require('history/lib/createBrowserHistory');
var AppController = require('../shared/components/app-controller.jsx');
//var ServerErrorController = require('./shared/components/ServerErrorController');
var SuccessDisplayController = require('../shared/components/success-display-controller'); // use this as a placeholder for successful requests.
var EditorController = require('../shared/components/editor-controller.jsx');
var AudioComponent = require('../shared/components/record-audio-component');
var SigninController = require('../shared/components/signin-controller.jsx');
var SongsController = require('../shared/components/songs-controller');
var EventController = require('../shared/components/event-controller');
var BrowseEvents = require('../shared/components/events/browse-events');
var CreateEvent = require('../shared/components/events/create-event');
var Editor = require('../shared/components/editor/editor.jsx');
var Profile = require('../shared/components/profile/profile.jsx');
var DemoProfile = require('../shared/components/profile/demo');

// -v x.13.x
/** Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  React.render(<Handler/>, document.getElementById('react-app'));
});**/
var node = document.getElementById('react-app');
var props = JSON.parse(decodeURIComponent(node.getAttribute('data-current-user')));
var store = (0, _redux.compose)((0, _redux.applyMiddleware)(_reduxThunk2.default), typeof window !== 'undefined' && window.devToolsExtension ? window.devToolsExtension() : function (args) {
  return args;
})(_redux.createStore)(_reducers.appReducer, {
  currentUser: { isAuthenticated: props.isAuthenticated, userId: props.profile.id },
  profile: _extends({}, props.profile)
});

// ReactDOM.render(App(), node);
// -v 1.0.0

(0, _reactDom.render)(_react2.default.createElement(
  _reactRedux.Provider,
  { store: store },
  _react2.default.createElement(
    _reactRouter.Router,
    { history: createBrowserHistory() },
    _react2.default.createElement(
      _reactRouter.Route,
      { path: '/', component: AppController },
      _react2.default.createElement(_reactRouter.Route, { path: '/signin', component: SigninController }),
      _react2.default.createElement(_reactRouter.Route, { path: '/success', component: SuccessDisplayController }),
      _react2.default.createElement(_reactRouter.Route, { path: '/editor', component: Editor }),
      _react2.default.createElement(_reactRouter.Route, { path: '/editor/:documentId', component: EditorController }),
      _react2.default.createElement(_reactRouter.Route, { path: '/audio', component: AudioComponent }),
      _react2.default.createElement(_reactRouter.Route, { path: '/events', component: EventController }),
      _react2.default.createElement(_reactRouter.Route, { path: '/events/browse', components: BrowseEvents }),
      _react2.default.createElement(_reactRouter.Route, { path: '/events/create', components: CreateEvent }),
      _react2.default.createElement(
        _reactRouter.Route,
        { path: '/profile(/:profileId)', components: Profile },
        _react2.default.createElement(_reactRouter.Route, { path: '/profile/create', component: _create2.default })
      ),
      _react2.default.createElement(_reactRouter.Route, { path: '/profile/demo', components: DemoProfile })
    ),
    _react2.default.createElement(_reactRouter.Route, { path: '/songs', component: SongsController })
  )
), node);
'use strict';

var path = require('path');

var config = module.exports = {
  port: process.env.PORT || 8080,
  dataBackend: 'datastore',
  gcloud: {
    projectId: process.env.GCLOUD_PROJECT || 'jovial-welder-128202',
    keyFilename: path.resolve(__dirname, '../Noteable-e4d2cea40c15.json')
  },
  cloudAudioStorageBucket: 'user-audio-files-staging',
  cloudImageStorageBucket: 'user-image-files-staging',
  connectionString: process.env.DATABASE_URL || 'postgres://bxujcozubyosgb:m1rgVoS1lEpdCZVRos6uWZVouU@ec2-54-235-146-58.compute-1.amazonaws.com:5432/d42dnjskegivlt?ssl=true'
};

var projectId = config.gcloud.projectId;

if (!projectId || projectId === 'your-project-id') {
  throw new Error('You must set the GCLOUD_PROJECT env var or add your ' + 'project id to config.js!');
}
'use strict';

require.ensure = require('node-ensure');

module.exports = {
  path: 'editor',

  /**getChildRoutes(location, callback) {
    require.ensure([], (require) => {
      callback(null, [
        require('./routes/Announcements'),
        require('./routes/Assignments'),
        require('./routes/Grades')
      ]);
    });
  },**/

  getComponent: function getComponent(location, callback) {
    require.ensure([], function () {
      callback(null, require('../shared/components/editor-controller'));
    });
  }
};
'use strict';

module.exports = {
  path: 'profile',

  getComponent: function getComponent(location, callback) {
    require.ensure([], function (require) {
      callback(null, require('../shared/components/profile/profile'));
    });
  }
};
'use strict';

module.exports = {
  path: 'signin',

  getComponent: function getComponent(location, callback) {
    require.ensure([], function (require) {
      callback(null, require('../shared/components/signin-controller'));
    });
  }
};
'use strict';

/*
	<Route path="/" component={ AppController }>
    <IndexRoute path="/" component={ AppController }/>
    <Route path="/signin" component={ SigninController }/>
		<Route path="/success" component={ SuccessDisplayController }/>
		<Route path="/editor" component= { EditorController }/>
    <Route path="/audio" component= { AudioComponent }/>
	</Route>
);*/

/*eslint-disable no-unused-vars */
var React = require('react');
var render = require('react-dom').render;
var Router = require('react-router').Router;
var browserHistory = require('react-router').browserHistory;
var AppController = require('./shared/components/app-controller');

module.exports = {
  component: 'div',
  childRoutes: [{
    path: '/',
    component: AppController,
    childRoutes: [require('./routes/signin'), require('./routes/editor'), require('./routes/profile')]
  }]
};

/*render(
  <Router history={browserHistory} routes={rootRoute} />,
  document.getElementById('example')
)*/
'use strict';

var _userService = require('./user-service');

var _userService2 = _interopRequireDefault(_userService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Formidable = require('formidable');
var config = require('../config');
var image = require('../util/gcloud-util')(config.gcloud, config.cloudImageStorageBucket);
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');

var regex = new RegExp(/[\0\x08\x09\x1a\n\r"'\\\%]/g);
function escaper(char) {
  var m = ['\\0', '\\x08', '\\x09', '\\x1a', '\\n', '\\r', "'", '"', '\\', '\\\\', '%'];
  var r = ['\\\\0', '\\\\b', '\\\\t', '\\\\z', '\\\\n', '\\\\r', "''", '""', '\\\\', '\\\\\\\\', '\\%'];
  return r[m.indexOf(char)];
};

module.exports = function (app, options) {
  var m_userService = new _userService2.default(options);

  app.get('/database', function (req, res) {
    options.connect(options.database, function (connection) {
      if (connection.status === 'SUCCESS') {
        res.status(200).send();
      } else {
        res.status(500).send();
      }
    });
  });

  app.get('/user/me', options.auth, function (req, res) {
    res.redirect('/user/' + req.user.id + '/profile');
  });

  app.get('/user/search/{text}', options.auth, function (req, res) {
    if (req.params.text.length === 0) {
      res.status(400).send();
    } else {
      //elasticsearch for users
    }
  });

  /**USER API**/

  app.post('/user/edit', options.auth, function (req, res) {
    console.log(req.body); // <- standard for getting things out post.

    options.connect(options.database, function (connection) {
      console.log(connection);
    });
    res.send('lol');
  });

  app.post('/register', function (req, res) {
    if (req.body.email == null || req.body.password == null) {
      res.status(400).send();
    }

    bcrypt.hash(req.body.password, null, null, function (err, password) {
      if (err) {
        res.status(500).send();
        return;
      }
      options.connect(options.database, function (connection) {
        connection.client.query('INSERT INTO public.user (username, email, password) VALUES (\'' + req.body.username + '\',\'' + req.body.email + '\', \'' + password + '\');').on('error', function (error) {
          console.log(error);
          res.send(error);
        }).on('end', function (result) {
          console.log(result);
          res.status(204).send();
          connection.fin();
        });
      });
    });
  });

  app.post('/user/profile/:userId', function (req, res) {
    if (req.user.id != req.params.userId) {
      res.status(400).send();
      return;
    }

    m_userService.updateProfile(req.body, function () {
      res.status(201).send();
    });
  });

  app.get('/user/:id', function (req, res) {
    if (!req.user) {
      res.status(400).send();
    }

    m_userService.getUser(req.params.id, function (user) {
      if (user == null) {
        res.status(404).send();
      }

      res.send(user);
    });
  });

  app.post('/user/edit/picture/new', options.auth, function (req, res) {
    if (!req.user) {
      res.status(400).send();
    }

    uploadPicture(req, res, function (gcloudResponse) {
      if (gcloudResponse == null) {
        res.status(500).send();
        return;
      }

      options.connect(options.database, function (connection) {
        var user = [];
        connection.client.query('INSERT INTO pictures (user_id, filename, picture_type) VALUES (' + req.user.id + ', \'' + gcloudResponse.cloudStorageObject + '\', 1);').on('row', function (row) {
          user.push(row);
        }).on('error', function (error) {
          console.log('error encountered ' + error);
        }).on('end', function () {
          connection.fin();
          res.status(200).send(gcloudResponse);
        });
      });
    });
  });

  app.post('/user/follow/:userId', options.auth, function (req, res) {
    if (!req.user) {
      res.status(400).send();
    }

    if (req.user.id === parseInt(req.params.userId, 10)) {
      res.status(204).send();
    }

    options.connect(options.database, function (connection) {
      connection.client.query('\n        INSERT INTO followers (origin, destination)\n        SELECT 1, 2\n        WHERE\n          NOT EXISTS (\n            SELECT * FROM followers WHERE origin = ' + req.user.id + ' AND destination = ' + req.params.userId + '\n          );\n      ').on('error', function (error) {
        console.log('error following user: ' + error);
      }).on('end', function () {
        connection.fin();
        res.status(200).send();
      });
    });
  });

  /** *PICTURES API* **/

  // Currently only works with one picture. No mass upload.
  var uploadPicture = function uploadPicture(req, res, next) {
    var form = new Formidable.IncomingForm();
    form.maxFieldsSize = 50 * 1024 * 1024;

    form.onPart = function (part) {
      form.handlePart(part);
    };

    form.parse(req, function (err, fields) {
      var buffer = new Buffer(fields[Object.keys(fields)[0]], 'base64');

      image.sendUploadToGCS(Object.keys(fields)[0], buffer, function (response) {
        if (response && response.error) {
          return null;
        }

        next(response);
      });
    });
  };

  /** MESSAGES API ***/

  app.get('/messages/:documentId/:index', options.auth, function (req, res) {
    if (!req.user) {
      res.status(400).send();
    }

    options.connect(options.database, function (connection) {
      var messages = [];
      connection.client.query('WITH documents AS\n        (SELECT id FROM documents WHERE profiles @> \'{' + req.user.id + '}\'::int[])\n        SELECT * FROM messages WHERE id > ' + req.params.index + ' AND document_id = ' + req.params.documentId + ' AND ' + req.params.documentId + ' IN\n        (SELECT id FROM documents) ORDER BY id DESC LIMIT 15;').on('error', function (error) {
        console.log(error);
      }).on('row', function (row) {
        messages.push(row);
      }).on('end', function () {
        res.send(messages.reverse());
        connection.fin();
      });
    });
  });

  /**
  Events API - consider moving the queries to elasticsearch to order by popularity of events and user ratings
  **/

  app.get('/api/events', function (req, res) {
    options.connect(options.database, function (connection) {
      var item = void 0;
      connection.client.query('SELECT * FROM events WHERE id = ' + req.query.eventId + ';').on('error', function (error) {
        res.status(404).send();
      }).on('row', function (event) {
        item = event;
      }).on('end', function () {
        res.status(200).send(item);
      });
    });
  });

  app.get('/api/events/nearby', function (req, res) {
    if (req.query.lat == null || req.query.lng == null || req.query.radius == null) {
      res.status(400).send({
        error: 'The request is missing some parameters'
      });
    }

    var maxLat = parseFloat(req.query.lat) + req.query.radius / 69.172;
    var minLat = req.query.lat - req.query.radius / 69.172;
    // compensate for degrees longitude getting smaller with increasing latitude
    var diff = req.query.radius / (Math.cos(req.query.lat) * 69.172);
    var maxLon = parseFloat(req.query.lng) + Math.abs(diff);
    var minLon = parseFloat(req.query.lng) - Math.abs(diff);

    options.connect(options.database, function (connection) {
      var events = [];
      connection.client.query('\n      WITH FirstCut AS (\n        SELECT * FROM events WHERE\n            cast(latitude as double precision) < ' + maxLat + ' AND cast(latitude as double precision) > ' + minLat + '\n            AND cast(longitude as double precision) < ' + maxLon + ' AND cast(longitude as double precision) > ' + minLon + '\n      )\n      SELECT * FROM FirstCut WHERE\n        sqrt(\n          power(\n            (cast(longitude as double precision) - ' + req.query.lng + ')*\n            (68.7*cos(radians(cast(latitude as double precision))))\n          , 2) +\n          power(\n            (cast(latitude as double precision) - ' + req.query.lat + ')*\n            69.172\n          , 2)\n        ) < ' + req.query.radius + ';\n      ').on('error', function (error) {
        console.log(error);
      }).on('row', function (row) {
        events.push(row);
      }).on('end', function () {
        res.status(200).send(events);
      });
    });
  });

  app.post('/api/events/create', options.auth, function (req, res) {
    var event = req.body;
    options.connect(options.database, function (connection) {
      var eventId = -1;
      connection.client.query('INSERT INTO events (name, notes, latitude, longitude, start_date, end_date, user_id) VALUES\n        (\n          \'' + event.eventName.replace(regex, escaper) + '\',\n          \'' + event.notes.replace(regex, escaper) + '\',\n          \'' + event.eventLatitude + '\',\n          \'' + event.eventLongitude + '\',\n          \'' + event.startDate + '\',\n          \'' + event.endDate + '\',\n          ' + req.user.id + '\n        );\n        SELECT LASTVAL();\n      ').on('error', function (error) {
        console.log('' + error);
        res.status(500).send();
      }).on('row', function (id) {
        eventId = id;
      }).on('end', function () {
        console.log(eventId);
        res.status(200).send(eventId);
      });
    });
  });

  app.get('/events/nearby/{location}', options.auth, function (req, res) {
    res.status(204).send();
    //how the hell do you search based on location?
  });

  //filter should be either host_average_rating OR event_committed_attendees
  app.get('/events/filter/{type}/{instrument}/{index}/{filter}', options.auth, function (req, res) {
    if (req.params.instrument.length === 0 && req.params.type.length === 0) {
      res.status(400).send();
    } else {
      (function () {
        var index = 0;
        var query = '';

        if (req.params.instrument.length === 0) {
          query = 'type = \'' + req.params.type + '\'';
        } else if (req.params.type.length === 0) {
          query = 'instrument \'' + req.params.instrument + '\'';
        } else {
          query = 'instrument \'' + req.params.instrument + '\' AND type = \'' + req.params.type + '\'';
        }

        if (req.params.index) {
          index = req.params.index;
        }

        index = 10 * index;

        options.connect(options.database, function (connection) {
          var events = [];

          //doesn't currently exclusively get events that haven't happened yet.j
          connection.client.query('SELECT * FROM public.events WHERE ' + query + ' LIMIT 10 OFFSET ' + index + ' ORDER BY ' + req.params.filter + ' DESC;').on('row', function (row) {
            events.push(row);
          }).on('end', function () {
            res.send(events);
            connection.fin();
          });
        });
      })();
    }
  });

  app.get('/events/user/{userId}', options.auth, function (req, res) {
    if (!req.params.userId) {
      res.status(400).send();
    } else {
      options.connect(options.database, function (connection) {
        var events = [];

        connection.client.query('SELECT * FROM public.events WHERE user_id = ' + req.params.userId + ';').on('row', function (row) {
          events.push(row);
        }).on('end', function () {
          res.send(events);
          connection.fin();
        });
      });
    }
  });

  /** DOCUMENTS API **/

  //Retrieve all song documents owned by user
  app.get('/songs/user', options.auth, function (req, res) {
    if (!req.user) {
      res.status(400).send();
    } else {
      options.connect(options.database, function (connection) {
        var songs = [];
        connection.client.query('SELECT id, title, description, date, modified, profiles FROM public.documents WHERE ' + req.user.id + ' = ANY (SELECT unnest(profiles) from public.documents);').on('row', function (row) {
          songs.push(row);
        }).on('end', function () {
          res.send(songs);
          connection.fin();
        });
      });
    }
  });

  app.get('/document/:documentId', options.auth, function (req, res) {
    if (!req.user) {
      res.status(400).send();
    }
    options.connect(options.database, function (connection) {
      var song = [];
      connection.client.query('SELECT * FROM public.documents\n        WHERE ' + req.user.id + ' = ANY (SELECT unnest(profiles) from public.documents) AND ' + req.params.documentId + ' = id;').on('row', function (row) {
        song.push(row);
      }).on('end', function () {
        if (song.length > 0) {
          res.send(song[0]);
          connection.fin();
        }
        res.status(404).send();
      });
    });
  });

  app.post('/document/:documentId', options.auth, function (req, res) {
    if (!req.user) {
      res.status(400).send();
    }
    options.connect(options.database, function (connection) {
      var song = [];
      connection.client.query('SELECT id, title, description, date, modified, profiles FROM public.documents\n        WHERE ' + req.user.id + ' = ANY (SELECT unnest(profiles) from public.documents) AND ' + req.params.documentId + ' = id;').on('row', function (row) {
        song.push(row);
      }).on('error', function (error) {
        console.log('error encountered ' + error);
      }).on('end', function () {
        if (song.length > 0) {
          connection.client.query('UPDATE public.documents SET contents = \'' + JSON.stringify(req.body) + '\', modified = current_timestamp\n            WHERE ' + req.user.id + ' = ANY (SELECT unnest(profiles) from public.documents) AND ' + req.params.documentId + ' = id;').on('row', function (row) {
            song.push(row);
          }).on('end', function () {
            res.status(200).send();
            connection.fin();
          });
        } else {
          // create the song
          connection.client.query('INSERT INTO documents (contents, date, modified, profiles) VALUES (\'' + JSON.stringify(req.body) + '\', current_timestamp, current_timestamp, \'{' + req.user.id + '}\');').on('row', function (row) {
            song.push(row);
          }).on('end', function () {
            res.status(200).send();
            connection.fin();
          });
        }
      });
    });
  });
};
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

var _userService = require('./user-service');

var _userService2 = _interopRequireDefault(_userService);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _serverUtil = require('./server-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('nodejs-dashboard');

var MongoStore = require('connect-mongo')(_expressSession2.default);

var env = process.env.NODE_ENV;
global.DEBUG = env !== 'production' && env !== 'internal';
global.PRODUCTION = env === 'production';
global.CLIENT = false;

var app = (0, _express2.default)();
app.use(_express2.default.static(__dirname + '/../../public'));
var config = require('../config');
var audio = require('../util/gcloud-util')(config.gcloud, config.cloudAudioStorageBucket);
var image = require('../util/gcloud-util')(config.gcloud, config.cloudImageStorageBucket);
var m_userService = new _userService2.default({ auth: _serverUtil.ensureAuthenticated, connect: _serverUtil.connectToDb, database: config.connectionString });

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
    url: 'mongodb://localhost:27017/'
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
  m_userService.getUser(req.user ? req.user.id : null, function (user) {
    res.render('index', {
      props: encodeURIComponent(JSON.stringify({
        isAuthenticated: user == null,
        profile: user
      }))
    });
  });
});

var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('JamSesh is listening at http://%s:%s', host, port);
});

require('./sockets')(server, { auth: _serverUtil.ensureAuthenticated, connect: _serverUtil.connectToDb, database: config.connectionString });
'use strict';

module.exports = function (server, options) {
  var io = require('socket.io').listen(server);

  io.on('connection', function (socket) {
    socket.join('' + socket.request._query.context);
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

    socket.on('message', function (message) {
      options.connect(options.database, function (connection) {
        var id = -1;
        connection.client.query('INSERT INTO MESSAGES (content, user_id, document_id, destination_id, time_stamp)\n           VALUES (\n             \'' + message.message + '\',\n             ' + message.userId + ',\n             ' + (message.documentId ? message.documentId : 'NULL') + ',\n             ' + (message.destinationId ? message.destinationId : 'NULL') + ',\n             now());\n             SELECT LASTVAL();').on('row', function (row) {
          id = parseInt(row.lastval);
        }).on('end', function () {
          var fullMessage = Object.assign({}, message, { id: id });
          io.sockets.in('' + fullMessage.documentId).emit('incoming', fullMessage);
        });
      });
    });
  });
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var userMapper = function userMapper(dbUser) {
  return {
    avatarUrl: dbUser.avatar_url,
    coverImage: dbUser.cover_url,
    id: dbUser.id,
    email: dbUser.email,
    location: dbUser.location,
    name: dbUser.name,
    bio: dbUser.bio,
    preferences: {
      instruments: dbUser.instruments.split(',')
    }
  };
};

var UserService = function () {
  function UserService(options) {
    _classCallCheck(this, UserService);

    this.options = options;
  }

  _createClass(UserService, [{
    key: 'getUser',
    value: function getUser(userId, callback) {
      if (userId == null) {
        callback({ id: -1 });
        return;
      }

      this.options.connect(this.options.database, function (connection) {
        if (connection.client == null) {
          return callback({ id: -1 });
        }

        var user = [];
        connection.client.query('\n        SELECT p.id, p.email, p.location, p.cover_url, p.name, p.avatar_url, p.bio, i.instruments FROM public.profile p, public.instruments i \n        WHERE p.id = i.user_id\n        AND ' + userId + ' = p.id;').on('row', function (row) {
          user.push(row);
        }).on('error', function (error) {
          console.log('error encountered ' + error);
          callback({ id: -1 });
        }).on('end', function () {
          if (user.length === 0) {
            callback({ id: -1 });
          }

          // user[0].profileImage = image.getPublicUrl(user[0].filename);
          connection.fin();
          callback(userMapper(user[0]));
        });
      });
    }
  }, {
    key: 'updateProfile',
    value: function updateProfile(profile, callback) {
      this.options.connect(this.options.database, function (connection) {
        connection.client.query('\n        UPDATE public.profile SET location = \'' + profile.location + '\', bio = $$' + profile.bio + '$$, cover_url = \'' + profile.coverImage + '\', name = \'' + profile.name + '\', avatar_url = \'' + profile.avatarUrl + '\'\n        WHERE id = ' + profile.id + ';\n        UPDATE public.instruments SET instruments = \'' + profile.preferences.instruments.toString() + '\'\n        WHERE user_id = ' + profile.id + ';\n      ').on('error', function (error) {
          console.log(error);
        }).on('end', function () {
          callback();
        });
      });
    }
  }]);

  return UserService;
}();

exports.default = UserService;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runWebpackDevServer = runWebpackDevServer;
var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var config = require('../../webpack.dev.config');

function runWebpackDevServer() {
  var bundleStart = null;
  var compiler = webpack(config);

  compiler.plugin('compile', function () {
    console.log('Bundling...');
    bundleStart = Date.now();
  });

  compiler.plugin('done', function () {
    console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms');
  });

  var server = new WebpackDevServer(compiler, {
    info: false,
    inline: true,
    host: 'localhost',
    colors: true,
    contentBase: 'dist',
    publicPath: '/dist/',
    hot: false,
    stats: { colors: true },
    headers: { 'Access-Control-Allow-Origin': '*' },
    watchOptions: {
      poll: 1000
    }
  });

  server.listen(8081, 'localhost', function () {
    console.log('webpack dev server running on 8081');
  });
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editorActionTypes = exports.profileActionTypes = undefined;

var _util = require('./util');

var profileActionTypes = exports.profileActionTypes = {
  loadUserTypes: (0, _util.createAsyncActionTypes)('PROFILE/LOAD_USER'),
  saveBioTypes: (0, _util.createAsyncActionTypes)('PROFILE/BIO'),
  saveProfileTypes: (0, _util.createAsyncActionTypes)('PROFILE/SAVE_PROFILE'),
  updateBioType: 'PROFILE/UPDATE_BIO',
  updateInstrumentsType: 'PROFILE/UPDATE_INSTRUMENTS'
};

var editorActionTypes = exports.editorActionTypes = {
  addChordType: 'EDITOR/ADD_CHORD',
  addLineType: 'EDITOR/ADD_LINE',
  addSectionType: 'EDITOR/ADD_SECTION',
  defaultEditorType: 'EDITOR/DEFAULT_EDITOR',
  deleteLineType: 'EDITOR/DELETE_LINE',
  moveChordsType: 'EDITOR/MOVE_CHORDS',
  updateLinesType: 'EDITOR/UPDATE_LINES',
  updateSelectedType: 'EDITOR/UPDATE_SELECTED',
  updateTextType: 'EDITOR/UPDATE_TEXT'
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editorActions = undefined;

var _actionTypes = require('./action-types');

var addChordType = _actionTypes.editorActionTypes.addChordType;
var addLineType = _actionTypes.editorActionTypes.addLineType;
var addSectionType = _actionTypes.editorActionTypes.addSectionType;
var defaultEditorType = _actionTypes.editorActionTypes.defaultEditorType;
var deleteLineType = _actionTypes.editorActionTypes.deleteLineType;
var moveChordsType = _actionTypes.editorActionTypes.moveChordsType;
var updateLinesType = _actionTypes.editorActionTypes.updateLinesType;
var updateSelectedType = _actionTypes.editorActionTypes.updateSelectedType;
var updateTextType = _actionTypes.editorActionTypes.updateTextType;
var editorActions = exports.editorActions = {
  initializeEditor: function initializeEditor(sectionData) {
    return {
      type: defaultEditorType,
      sectionData: sectionData
    };
  },
  addSection: function addSection() {
    return {
      type: addSectionType
    };
  },
  updateLines: function updateLines(sectionId, lineActions, selectedIndex, offset) {
    return {
      type: updateLinesType,
      sectionId: sectionId,
      lineActions: lineActions,
      selectedIndex: selectedIndex,
      offset: offset
    };
  },
  addLine: function addLine(sectionId, lineId, index, type, text) {
    var shouldUpdateIndex = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
    var offset = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
    return {
      type: addLineType,
      lineType: type,
      sectionId: sectionId,
      lineId: lineId,
      index: index,
      text: text,
      shouldUpdateIndex: shouldUpdateIndex,
      offset: offset
    };
  },
  deleteLine: function deleteLine(sectionId, index) {
    return {
      type: deleteLineType,
      sectionId: sectionId,
      index: index
    };
  },
  updateText: function updateText(sectionId, lineId, text, offset) {
    return {
      type: updateTextType,
      sectionId: sectionId,
      lineId: lineId,
      text: text,
      offset: offset
    };
  },
  updateSelected: function updateSelected(sectionId, index, offset) {
    return {
      type: updateSelectedType,
      sectionId: sectionId,
      index: index,
      offset: offset
    };
  },
  addChord: function addChord(sectionId, lineId, text, index, updateSelectedFunction) {
    return {
      type: addChordType,
      sectionId: sectionId,
      lineId: lineId,
      text: text,
      index: index,
      updateSelectedFunction: updateSelectedFunction
    };
  },
  moveChords: function moveChords(sectionId, lineId, index, offset) {
    return {
      type: moveChordsType,
      sectionId: sectionId,
      lineId: lineId,
      index: index,
      offset: offset
    };
  }
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _editorActions = require('./editor-actions');

Object.keys(_editorActions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _editorActions[key];
    }
  });
});

var _profileActions = require('./profile-actions');

Object.keys(_profileActions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _profileActions[key];
    }
  });
});
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.profileActions = undefined;

var _actionTypes = require('./action-types');

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadUserTypes = _actionTypes.profileActionTypes.loadUserTypes;
var saveBioTypes = _actionTypes.profileActionTypes.saveBioTypes;
var saveProfileTypes = _actionTypes.profileActionTypes.saveProfileTypes;
var updateBioType = _actionTypes.profileActionTypes.updateBioType;
var updateInstrumentsType = _actionTypes.profileActionTypes.updateInstrumentsType;
var profileActions = exports.profileActions = {
  loadUser: function loadUser() {
    return function (dispatch) {
      window.fetch('/me', {
        credentials: 'same-origin',
        method: 'GET',
        headers: {
          accept: 'application/json'
        }
      }).then(_util2.default, function () {
        dispatch({
          type: loadUserTypes.error
        });
      }).then(function (response) {
        return response.json();
      }).then(function (result) {
        dispatch({
          type: loadUserTypes.success,
          result: result
        });
      }, function () {
        dispatch({
          type: loadUserTypes.error
        });
      });
    };
  },

  validateBio: function validateBio(bio) {
    return function (dispatch) {
      if (bio.length > 5000) {
        dispatch({
          type: saveBioTypes.error
        });

        return;
      }

      dispatch({
        type: saveBioTypes.success
      });
    };
  },

  saveProfile: function saveProfile(profile) {
    return function (dispatch) {
      dispatch({
        type: saveProfileTypes.processing
      });

      window.fetch('/user/profile/' + profile.id, {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      }).then(_util2.default, function () {
        dispatch({
          type: saveProfileTypes.error
        });
      }).then(_util2.default, function () {
        console.log('bad status code returned');
      }).then(function () {
        dispatch({
          type: saveProfileTypes.success,
          profile: profile
        });
      }, function () {
        dispatch({
          type: saveProfileTypes.error
        });
      });
    };
  },

  updateBio: function updateBio(bio) {
    return {
      type: updateBioType,
      bio: bio
    };
  },

  updateInstruments: function updateInstruments(instrument) {
    return {
      type: updateInstrumentsType,
      instrument: instrument
    };
  }
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createAsyncActionTypes = exports.createAsyncActionTypes = function createAsyncActionTypes(actionType) {
  return {
    success: actionType + "-SUCCESS",
    error: actionType + "-ERROR",
    processing: actionType + "-PROCESSING"
  };
};

var checkStatus = exports.checkStatus = function checkStatus(response) {
  if (response.status < 200 || response.status >= 400) {
    throw response.status;
  }

  return response;
};
'use strict';

var AJAX = {
  get: function get(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.status === 200) {
        callback(this.response);
      }
    };
    xhr.open('GET', url, true);
    xhr.setRequestHeader('accept', 'application/json');
    xhr.send(null);
  },

  post: function post(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('accept', 'application/json');
    xhr.onload = function () {
      callback(this.response, this);
    };
    xhr.send(data);
  },

  postBlob: function postBlob(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('accept', 'application/json');
    xhr.onload = function () {
      callback(this.response);
    };
    xhr.send(data);
  },

  postJSON: function postJSON(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('accept', 'application/json');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = function () {
      callback(this.response);
    };
    xhr.send(JSON.stringify(data));
  }
};

module.exports = AJAX;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _home = require('./home.jsx');

var _home2 = _interopRequireDefault(_home);

require('./app-styles/app-controller.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = (_temp = _class = function (_Component) {
  _inherits(AppController, _Component);

  function AppController() {
    _classCallCheck(this, AppController);

    return _possibleConstructorReturn(this, (AppController.__proto__ || Object.getPrototypeOf(AppController)).apply(this, arguments));
  }

  _createClass(AppController, [{
    key: 'renderHome',
    value: function renderHome() {
      return _react2.default.createElement(_home2.default, null);
    }
  }, {
    key: 'renderGrid',
    value: function renderGrid() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('div', { className: 'testing-verticals' }),
        _react2.default.createElement('div', { className: 'testing-horizontal' })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('link', { href: '/css/bundle.css', rel: 'stylesheet', type: 'text/css' }),
        _react2.default.createElement('link', { href: 'https://fonts.googleapis.com/css?family=Lobster', rel: 'stylesheet' }),
        this.props.location.pathname === '/' ? this.renderHome() : this.props.children
      );
    }
  }]);

  return AppController;
}(_react.Component), _class.propTypes = {
  location: _react.PropTypes.shape({
    pathname: _react.PropTypes.string.isRequired
  }),
  children: _react.PropTypes.object
}, _temp);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ajax = require('../../ajax');

var _ajax2 = _interopRequireDefault(_ajax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = (_temp2 = _class = function (_Component) {
  _inherits(Login, _Component);

  function Login() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Login);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Login.__proto__ || Object.getPrototypeOf(Login)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      emaill: '',
      password: '',
      loginFailed: false
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Login, [{
    key: 'login',
    value: function login() {
      var _this2 = this;

      _ajax2.default.post('auth/local?username=' + this.state.email + '&password=' + this.state.password, null, function (junk, response) {
        if (response.status === 200) {
          window.location = '/profile';
          return;
        }

        _this2.setState({
          loginFailed: true
        });
      });
    }
  }, {
    key: 'updateForm',
    value: function updateForm() {
      this.setState({
        email: this._email.value,
        password: this._password.value
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        'div',
        { className: 'login-container' },
        _react2.default.createElement(
          'div',
          { className: 'login-container__header' },
          'Sign In'
        ),
        _react2.default.createElement(
          'div',
          { className: 'signin-form' },
          this.state.loginFailed ? _react2.default.createElement(
            'div',
            { className: 'signin-form__error-message' },
            'Invalid username or password'
          ) : null,
          _react2.default.createElement('input', { className: 'signin-form__username', name: 'email', onChange: function onChange() {
              return _this3.updateForm();
            }, placeholder: 'Email', ref: function ref(_ref2) {
              _this3._email = _ref2;
            } }),
          _react2.default.createElement('input', { className: 'signin-form__password', name: 'password', onChange: function onChange() {
              return _this3.updateForm();
            }, type: 'password', placeholder: 'Password', ref: function ref(_ref3) {
              _this3._password = _ref3;
            } }),
          _react2.default.createElement(
            'button',
            { className: 'signin-form__submit-button', onClick: function onClick() {
                return _this3.login();
              } },
            'Submit'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'button-container' },
          _react2.default.createElement(
            'a',
            { href: 'auth/facebook' },
            _react2.default.createElement(
              'button',
              { className: 'button-container__submit-button', onClick: function onClick() {
                  return _this3.facebookLogin();
                } },
              'Login with Facebook'
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'button-container' },
          _react2.default.createElement(
            'div',
            { className: 'button-container__open-register', onClick: function onClick() {
                return _this3.props.switchToRegister();
              } },
            'Create an account'
          )
        )
      );
    }
  }]);

  return Login;
}(_react.Component), _class.propTypes = {
  switchToRegister: _react.PropTypes.func.isRequired
}, _temp2);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require("react");

module.exports = function (_React$Component) {
  _inherits(Logout, _React$Component);

  function Logout() {
    _classCallCheck(this, Logout);

    return _possibleConstructorReturn(this, (Logout.__proto__ || Object.getPrototypeOf(Logout)).apply(this, arguments));
  }

  _createClass(Logout, [{
    key: "logout",
    value: function logout() {
      var xhr = new XMLHttpRequest();
      xhr.onload = function (response) {
        if (response.target.status === 200) {
          window.location.href = "/";
        } else {
          window.alert("sorry you failed to log out");
        }
      };
      xhr.open("GET", "/logout", true);
      xhr.send(null);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "logout-button" },
        React.createElement(
          "button",
          { className: "logout-button__submit-button", onClick: this.logout },
          "Logout of Facebook"
        )
      );
    }
  }]);

  return Logout;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ajax = require('../../ajax');

module.exports = (_temp2 = _class = function (_Component) {
  _inherits(Register, _Component);

  function Register() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Register);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Register.__proto__ || Object.getPrototypeOf(Register)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      registerFailed: false
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Register, [{
    key: 'facebookLogin',
    value: function facebookLogin() {
      window.location.href = 'auth/facebook';
    }
  }, {
    key: 'updateForm',
    value: function updateForm() {
      this.setState({
        email: this._email.value,
        password: this._password.value,
        user: this._username.value,
        registerFailed: false
      });
    }
  }, {
    key: 'registerUser',
    value: function registerUser() {
      var _this2 = this;

      var password = this.state.password;
      var username = this.state.username;
      var email = this.state.email;

      ajax.post('/register', JSON.stringify({ email: email, password: password, username: username }), function (response) {
        if (response && JSON.parse(response).name === 'error') {
          _this2.setState({
            registerFailed: true
          });

          return;
        }

        ajax.post('auth/local?username=' + email + '&password=' + password, null, function (stuff, resp) {
          if (resp.status === 200) {
            window.location = '/profile';
            return;
          }

          _this2.setState({
            registerFailed: true
          });
        });
      });
      return false;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        'div',
        { className: 'register-container' },
        _react2.default.createElement(
          'div',
          { className: 'register-container__header' },
          'Register'
        ),
        _react2.default.createElement(
          'div',
          { className: 'register-form' },
          this.state.registerFailed ? _react2.default.createElement(
            'div',
            { className: 'register-form__error-message' },
            'Email already exists'
          ) : null,
          _react2.default.createElement('input', { className: 'register-form__username', name: 'name', onChange: function onChange() {
              return _this3.updateForm();
            }, type: 'text', placeholder: 'Name', ref: function ref(_ref2) {
              _this3._username = _ref2;
            } }),
          _react2.default.createElement('input', { className: 'register-form__password__verify', name: 'email', onChange: function onChange() {
              return _this3.updateForm();
            }, placeholder: 'Email', ref: function ref(_ref3) {
              _this3._email = _ref3;
            } }),
          _react2.default.createElement('input', { className: 'register-form__password', name: 'password', onChange: function onChange() {
              return _this3.updateForm();
            }, type: 'password', placeholder: 'Password', ref: function ref(_ref4) {
              _this3._password = _ref4;
            } }),
          _react2.default.createElement(
            'button',
            { className: 'signin-form__submit-button', onClick: function onClick() {
                return _this3.registerUser();
              } },
            'Submit'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'button-container' },
          _react2.default.createElement(
            'button',
            { className: 'button-container__submit-button', onClick: function onClick() {
                return _this3.facebookLogin();
              } },
            'Sign up with Facebook'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'button-container' },
          _react2.default.createElement(
            'div',
            { className: 'button-container__open-register', onClick: function onClick() {
                return _this3.props.switchToLogin();
              } },
            'Sign in'
          )
        )
      );
    }
  }]);

  return Register;
}(_react.Component), _class.propTypes = {
  switchToLogin: _react.PropTypes.func.isRequired
}, _temp2);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _keyCodes = require('../helpers/keyCodes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = (_temp2 = _class = function (_Component) {
  _inherits(Chord, _Component);

  function Chord() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Chord);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Chord.__proto__ || Object.getPrototypeOf(Chord)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      contentEditable: true
    }, _this.handleKeyDown = function (e) {
      if (e.keyCode === _keyCodes.KeyCodes.enter) {
        e.preventDefault();
        _this.props.updateSelectedToTextLine();
      } else if (e.keyCode !== _keyCodes.KeyCodes.space && e.keyCode !== _keyCodes.KeyCodes.backspace && (e.keyCode < 48 || e.keyCode > 90)) {
        e.preventDefault();
      }

      e.stopPropagation();
    }, _this.getDataForPost = function () {
      var element = (0, _reactDom.findDOMNode)(_this.refs.chord);
      return { index: _this.props.index, text: element.innerHTML };
    }, _this.setCaretInEmptyDiv = function () {
      var element = (0, _reactDom.findDOMNode)(_this.refs.chord);
      var range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Chord, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setCaretInEmptyDiv();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'span',
        { className: 'editor-chord-container' },
        _react2.default.createElement(
          'span',
          { contentEditable: 'false' },
          _react2.default.createElement(
            'span',
            {
              className: 'editor-chord',
              ref: 'chord',
              onKeyDown: this.handleKeyDown,
              contentEditable: this.state.contentEditable,
              suppressContentEditableWarning: true
            },
            this.props.text
          )
        )
      );
    }
  }]);

  return Chord;
}(_react.Component), _class.propTypes = {
  index: _react.PropTypes.number.isRequired,
  text: _react.PropTypes.string.isRequired,
  updateSelectedToTextLine: _react.PropTypes.func.isRequired
}, _temp2);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Section = require('./section.jsx');
var AJAX = require('../../ajax');

var EditorComponent = function (_Component) {
  _inherits(EditorComponent, _Component);

  function EditorComponent(props, context) {
    _classCallCheck(this, EditorComponent);

    var _this = _possibleConstructorReturn(this, (EditorComponent.__proto__ || Object.getPrototypeOf(EditorComponent)).call(this, props, context));

    _this.sections = 0;
    _this.lines = 0;
    _this.state = {};
    return _this;
  }

  _createClass(EditorComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (this.props.routeParams.documentId) {
        AJAX.get('/document/' + this.props.routeParams.documentId, function (response) {
          var sectionData = JSON.parse(JSON.parse(response).contents).sectionData;
          sectionData[0] = Object.assign({}, sectionData[0], { selectedIndex: 0, selectedLine: sectionData[0].lineData[0] });
          _this2.props.sectionDispatch.initializeEditor(sectionData);
        });
      } else {
        var sectionData = [this.addSection(this.sections, 'text')];
        this.props.sectionDispatch.initializeEditor(sectionData);
      }
    }
  }, {
    key: 'addSection',
    value: function addSection(sectionNumber, type) {
      return { sectionId: sectionNumber, type: type, lineData: [] };
    }
  }, {
    key: 'newTextLine',
    value: function newTextLine(id, text) {
      return { lineId: id, text: text, type: 'text' };
    }
  }, {
    key: 'newRecordingLine',
    value: function newRecordingLine(id) {
      return { lineId: id, type: 'recording' };
    }
  }, {
    key: 'submitRevision',
    value: function submitRevision() {
      var _this3 = this;

      var sectionContents = [];

      this.refs.map(function (section) {
        var sectionContent = _this3.refs[section].getDataForPost();
        sectionContents.push(sectionContent);
        return null;
      });

      var postBody = { sectionData: sectionContents };
      AJAX.postJSON('/document/' + this.props.routeParams.documentId, postBody, function (response) {
        return _this3.updated(JSON.parse(response));
      });
    }

    /** updated (response) {
      //TODO: do something with the successful response
    }**/

  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var sectionElements = this.props.sectionData.map(function (section) {
        return _react2.default.createElement(Section, {
          sectionId: section.sectionId,
          sectionDispatch: _this4.props.sectionDispatch,
          key: section.sectionId,
          ref: 'section' + section.sectionId,
          section: section,
          lines: _this4.lines,
          addSection: _this4.addSection,
          newTextLine: _this4.newTextLine,
          newRecordingLine: _this4.newRecordingLine,
          submitRevision: function submitRevision() {
            return _this4.submitRevision;
          },
          suppressContentEditableWarning: true
        });
      });
      return _react2.default.createElement(
        'div',
        { className: 'editor', contentEditable: 'false' },
        _react2.default.createElement(
          'button',
          { className: 'submitButton', onClick: function onClick() {
              return _this4.submitRevision;
            } },
          ' Submit Revision'
        ),
        sectionElements
      );
    }
  }]);

  return EditorComponent;
}(_react.Component);

EditorComponent.propTypes = {
  routeParams: _react.PropTypes.shape({
    documentId: _react.PropTypes.string
  }).isRequired,
  sectionData: _react.PropTypes.arrayOf(_react.PropTypes.shape({
    sectionId: _react.PropTypes.number.isRequired,
    type: _react.PropTypes.string
  }).isRequired).isRequired,
  sectionDispatch: _react.PropTypes.shape({
    initializeEditor: _react.PropTypes.func.isRequired
  }).isRequired
};


module.exports = EditorComponent;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _chord = require('./chord.jsx');

var _chord2 = _interopRequireDefault(_chord);

var _textBlock = require('./textBlock.jsx');

var _textBlock2 = _interopRequireDefault(_textBlock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Line = function (_Component) {
  _inherits(Line, _Component);

  function Line() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Line);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Line.__proto__ || Object.getPrototypeOf(Line)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      selected: _this.props.selected ? 'selected' : '',
      enterPressed: false,
      keyMap: []
    }, _this.getDataForPost = function () {
      var chords = [];
      if (_this.props.chords) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _this.props.chords[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var chord = _step.value;

            var chordContent = _this['chord' + chord.index].getDataForPost();
            chords.push(chordContent);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      var lineContent = _this.getLineContent();
      return { lineId: _this.props.lineId, type: _this.props.type, text: lineContent, chords: chords };
    }, _this.getLineContent = function () {
      var element = (0, _reactDom.findDOMNode)(_this._line).cloneNode(true);
      while (element.lastElementChild) {
        element.removeChild(element.lastElementChild);
      }
      return element.innerText;
    }, _this.setCaretInEmptyDiv = function () {
      var element = (0, _reactDom.findDOMNode)(_this._line);
      var range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }, _this.setCaretPosition = function (position) {
      var element = (0, _reactDom.findDOMNode)(_this._line);
      if (element.childNodes.length !== 0) {
        var caretPos = position > element.firstChild.length ? element.firstChild.length : position;
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        range.setStart(element.firstChild, caretPos);
        range.setEnd(element.firstChild, caretPos);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        _this.setCaretInEmptyDiv();
      }
    }, _this.handleClick = function () {
      console.log('click');
      _this.props.updateSelected(_this.props.lineId);
    }, _this.compareChords = function (a, b) {
      return a.index - b.index;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Line, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.selected) {
        this.setCaretPosition(this.props.offset);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.html !== (0, _reactDom.findDOMNode)(this._line).innerHTML;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (this.props.lineId === prevProps.lineId && this.props.text === prevProps.text && this.props.selected === prevProps.selected && this.props.offset === prevProps.offset) {
        return;
      }

      if (this.props.selected) {
        this.setCaretPosition(this.props.offset);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.handleDelete) {
        this.props.handleDelete((0, _reactDom.findDOMNode)(this._line).innerHTML);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var lastTextIndex = 0;
      var content = [];
      if (this.props.chords) {
        var sortedChords = this.props.chords;
        sortedChords.sort(this.compareChords);
        var chords = sortedChords.map(function (chord) {
          var text = _this2.props.text.substring(lastTextIndex, chord.index);
          content.push(_react2.default.createElement(_textBlock2.default, { text: text, index: lastTextIndex }));
          lastTextIndex = chord.index;
          return _react2.default.createElement(_chord2.default, {
            key: 'chord' + chord.index,
            ref: 'chord' + chord.index,
            index: chord.index,
            text: chord.text || '',
            updateSelectedToTextLine: function updateSelectedToTextLine() {
              return _this2.props.updateSelected(_this2.props.lineId);
            } });
        });
        content.push(_react2.default.createElement(_textBlock2.default, { text: this.props.text.substring(lastTextIndex, this.props.text.length), index: lastTextIndex }));
        for (var i = 0; i < chords.length; i++) {
          content.splice(i * 2 + 1, 0, chords[i]);
        }
      } else {
        content = this.props.text;
      }

      return _react2.default.createElement(
        'p',
        {
          className: 'editor-line',
          name: this.props.lineId,
          ref: function ref(_ref2) {
            _this2._line = _ref2;
          },
          onClick: this.handleClick,
          onChange: this.handleInput,
          suppressContentEditableWarning: true
        },
        content
      );
    }
  }]);

  return Line;
}(_react.Component);

Line.propTypes = {
  chords: _react.PropTypes.arrayOf(_react.PropTypes.shape({})),
  lineId: _react.PropTypes.number.isRequired,
  updateSelected: _react.PropTypes.func.isRequired,
  handleDelete: _react.PropTypes.func.isRequired,
  text: _react.PropTypes.string,
  type: _react.PropTypes.string,
  updateTextFunction: _react.PropTypes.func.isRequired,
  offset: _react.PropTypes.number,
  selected: _react.PropTypes.bool
};


module.exports = Line;
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AudioComponent = require('../record-audio-component');

var RecordingLine = function RecordingLine() {
  return _react2.default.createElement(
    'div',
    { className: 'editor-recording' },
    _react2.default.createElement(
      'span',
      { contentEditable: 'false' },
      _react2.default.createElement(AudioComponent, null)
    )
  );
};

module.exports = RecordingLine;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _keyCodes = require('../helpers/keyCodes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// in case you were wondering. No I don't approve of this. But I see the reason and don't want to think about it.
// I've removed your batching because I don't think it makes a difference. We can discuss it later.
// import { addLine, updateText } from './actions/editor-actions';

var Line = require('./line.jsx');
var RecordingLine = require('./recordingLine.jsx');
var Tooltip = require('./tooltip.jsx');

var Section = function (_Component) {
  _inherits(Section, _Component);

  function Section() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Section);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Section.__proto__ || Object.getPrototypeOf(Section)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      enterPressed: false,
      keyMap: [],
      lineData: [],
      lines: _this.props.lines,
      shouldUpdate: true
    }, _this.shouldComponentUpdate = function () {
      return _this.checkIfShouldUpdate();
    }, _this.getDataForPost = function () {
      var lineContents = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _this.props.section.lineData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var line = _step.value;

          var lineContent = _this['line' + line.lineId].getDataForPost();
          lineContents.push(lineContent);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return { sectionId: _this.props.sectionId, lineData: lineContents };
    }, _this.checkIfShouldUpdate = function () {
      var shouldUpdate = _this.state.shouldUpdate;
      _this.state.shouldUpdate = true;
      return shouldUpdate;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Section, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.props.section.lineData) {
        this.props.sectionDispatch.addLine(this.props.sectionId, this.lines++, 0, 'text', '');
      } else {
        this.state.lines = this.props.section.lineData.length;
      }
    }
  }, {
    key: 'handlePaste',
    value: function handlePaste(e) {
      e.preventDefault();
      var plainText = e.clipboardData.getData('text/plain');
      if (plainText) {
        var lineData = this.props.section.lineData;
        var lines = plainText.split('\n').filter(function (line) {
          return line !== '';
        });
        var selectedIndex = this.props.section.selectedIndex;
        var selected = this.props.section.selectedLine;
        lineData[selectedIndex].text = lines[0];
        // const lineActions = [];

        for (var i = 1; i < lines.length - 1; i++) {
          this.lines++;
          this.props.sectionDispatch.addLine(this.props.sectionId, this.lines, selectedIndex + i, 'text', lines[i]);
          // lineActions.push(addLine(this.props.sectionId, this.lines, selectedIndex + i, 'text', lines[i]));
        }
        if (lines.length > 1) {
          this.lines++;
          this.props.sectionDispatch.addLine(this.props.sectionId, this.lines, selectedIndex + (lines.length - 1), 'text', lines[lines.length - 1]);
          // lineActions.push(addLine(this.props.sectionId, this.lines, selectedIndex + lines.length - 1, 'text', lines[lines.length - 1]));
        }
        var currentText = (0, _reactDom.findDOMNode)(this[selected.ref]);
        this.props.sectionDispatch.updateText(this.props.sectionId, selected.lineId, currentText + lines[0], 0);
        // lineActions.push(updateText(this.props.sectionId, selected.lineId, currentText + lines[0], 0));
        // selectedIndex = selectedIndex + (lines.length - 1);
        // this.props.dispatch(updateLines(this.props.sectionId, lineActions, selectedIndex, lines[lines.length - 1].length));
      }
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(e) {
      this.keyMap[e.keyCode] = e.type === 'keydown';
      /* Note: this is *probably* really bad. It should work by keeping a collection of functions for keycodes that need them,
        and then calling the function for that keycode if it exists instead of doing if else for all possible keys that have functions.
        But for relatively small numbers of hotkeys/overrides it doesn't matter */
      if (e.keyCode === _keyCodes.KeyCodes.enter) {
        if (!e.target.classList.contains('editor-chord')) {
          e.preventDefault();
          this.enterPressed = true;
          var selection = window.getSelection();
          var selectionOffset = selection.baseOffset;
          var text = selection.anchorNode.data;
          var movedText = text.substring(selectionOffset, text.length);
          var remainingText = text.substring(0, selectionOffset);
          this.handleEnter.bind(this)(remainingText, movedText);
        }
      } else if (e.keyCode === _keyCodes.KeyCodes.upArrow) {
        e.preventDefault();
        var _selectionOffset = window.getSelection().baseOffset;
        this.handleUpArrow(_selectionOffset, this.props.section.selectedLine.lineId);
      } else if (e.keyCode === _keyCodes.KeyCodes.downArrow) {
        e.preventDefault();
        var _selectionOffset2 = window.getSelection().baseOffset;
        this.handleDownArrow(_selectionOffset2, this.props.section.selectedLine.lineId);
      } else if (e.keyCode === _keyCodes.KeyCodes.backspace) {
        if (window.getSelection().baseOffset === 0 && this.props.section.selectedIndex !== 0) {
          e.preventDefault();
          var selectedIndex = this.props.section.selectedIndex;
          this.props.sectionDispatch.deleteLine(this.props.sectionId, selectedIndex);
        }
      } else if (e.keyCode === _keyCodes.KeyCodes.r) {
        // new recording line
        if (this.keyMap[_keyCodes.KeyCodes.alt] && (e.metaKey || e.ctrlKey)) {
          this.props.sectionDispatch.addLine(this.props.sectionId, ++this.lines, this.props.section.selectedIndex + 1, 'recording', '', false);
        }
      } else if (e.keyCode === _keyCodes.KeyCodes.s) {
        // save
        if (this.keyMap[_keyCodes.KeyCodes.alt] && e.metaKey) {
          this.props.submitRevision();
        }
      } else if (e.keyCode === _keyCodes.KeyCodes.c) {
        // new chord Line
        if (this.keyMap[_keyCodes.KeyCodes.alt] && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          // TODO: Add keyboard shortcut for chord
        }
      }
    }
  }, {
    key: 'handleOnClick',
    value: function handleOnClick() {
      if (this.tooltip) {
        (0, _reactDom.unmountComponentAtNode)(this._tooltip);
      }

      var selection = window.getSelection();
      var range = selection.getRangeAt(0);
      if (range.startOffset !== range.endOffset) {
        this.tooltip = this.showTooltip(selection);
      }
    }
  }, {
    key: 'handleKeyUp',
    value: function handleKeyUp(e) {
      this.keyMap[e.keyCode] = e.type === 'keydown';
      if (e.keyCode === 8) {// delete
      }
    }
  }, {
    key: 'handleOnFocus',
    value: function handleOnFocus() {
      this.isFocused = true;
      if (this.props.section.lineData.length === 1) {
        this._section.childNodes[this.props.section.selectedIndex].focus();
      }
    }
  }, {
    key: 'handleOnBlur',
    value: function handleOnBlur() {
      this.isFocused = false;
    }
  }, {
    key: 'showTooltip',
    value: function showTooltip(selection) {
      var _this2 = this;

      var range = selection.getRangeAt(0);
      var rect = range.getBoundingClientRect();

      var tooltip = (0, _reactDom.render)(_react2.default.createElement(Tooltip, {
        element: selection.anchorNode.parentElement,
        rect: rect,
        addChord: function addChord() {
          return _this2.addChord();
        },
        addRecordingLine: function addRecordingLine() {
          return _this2.props.sectionDispatch.addLine(_this2.props.sectionId, ++_this2.lines, _this2.props.section.selectedIndex + 1, 'recording', '', false);
        }
      }), this._tooltip);

      return tooltip;
    }
  }, {
    key: 'handleOnSelect',
    value: function handleOnSelect(e) {
      console.log(e);
      // const selection = window.getSelection();
    }

    // Need a way of adding the update selected function back in after retreiving saved chords\
    // could be moved to line where we set update selected to currentTetIndex + length of chord text
    // Also chords aren't being mounted to the dom properly. possibly because of html comments?

  }, {
    key: 'addChord',
    value: function addChord() {
      var _this3 = this;

      var selection = window.getSelection();
      var range = selection.getRangeAt(0);

      var startIndex = parseInt(selection.baseNode.parentElement.getAttribute('data-index')) || 0;

      this.props.sectionDispatch.addChord(this.props.sectionId, this.props.section.selectedLine.lineId, '', startIndex + range.startOffset, function () {
        _this3.props.sectionDispatch.updateSelected(_this3.props.sectionId, _this3.props.section.selectedIndex, range.endOffset + 1);
      });

      if (this.tooltip) {
        (0, _reactDom.unmountComponentAtNode)(this._tooltip);
      }
    }
  }, {
    key: 'updateSelected',
    value: function updateSelected(lineId) {
      this.shouldUpdate = false;
      var selectedIndex = this.props.section.lineData.findIndex(function (e) {
        return e.lineId === lineId;
      });
      this.props.sectionDispatch.updateSelected(this.props.sectionId, selectedIndex, 0);
    }
  }, {
    key: 'handleEnter',
    value: function handleEnter(remainingText, movedText) {
      var selected = this.props.section.selectedLine;
      var selectedIndex = this.props.section.selectedIndex;

      this.props.sectionDispatch.addLine(this.props.sectionId, ++this.lines, selectedIndex + 1, 'text', movedText);
      this.props.sectionDispatch.updateText(this.props.sectionId, selected.lineId, remainingText, 0);
      // const lineActions = [addLine(this.props.sectionId, ++this.lines, selectedIndex + 1, 'text', movedText)];
      // lineActions.push(updateText(this.props.sectionId, selected.lineId, remainingText, 0));
      // this.props.dispatch(updateLines(this.props.sectionId, lineActions, selectedIndex + 1, 0));
    }
  }, {
    key: 'handleDelete',
    value: function handleDelete(text) {
      var selected = this.props.section.selectedLine;
      // const selectedIndex = this.props.section.selectedIndex;
      var offset = text.length;
      var currentText = (0, _reactDom.findDOMNode)(this[selected.ref]);
      // TODO: Figure out how to get the correct offset
      this.props.sectionDispatch.updateText(this.props.sectionId, selected.lineId, currentText + text, offset);
    }
  }, {
    key: 'handleUpArrow',
    value: function handleUpArrow(offset, lineId) {
      if (this.props.section.lineData[0].lineId !== lineId) {
        var index = this.props.section.lineData.findIndex(function (e) {
          return e.lineId === lineId;
        });
        this.props.sectionDispatch.updateSelected(this.props.sectionId, index - 1, offset);
      }
    }
  }, {
    key: 'handleDownArrow',
    value: function handleDownArrow(offset, lineId) {
      if (this.props.section.lineData[this.props.section.lineData.length - 1].lineId !== lineId) {
        var index = this.props.section.lineData.findIndex(function (e) {
          return e.lineId === lineId;
        });
        this.props.sectionDispatch.updateSelected(this.props.sectionId, index + 1, offset);
      }
    }
  }, {
    key: 'clearLinesToUpdate',
    value: function clearLinesToUpdate() {
      this.linesToUpdate = [];
    }
  }, {
    key: 'handleInput',
    value: function handleInput() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.lineElements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var elem = _step2.value;

          this[elem.ref].handleInput();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var lineData = this.props.section.lineData;
      var lineElements = this.lineElements = lineData.map(function (line) {
        if (line.type === 'text') {
          var selected = line.lineId === _this4.props.section.lineData[_this4.props.section.selectedIndex].lineId;
          var offset = selected ? _this4.props.section.offset : 0;
          return _react2.default.createElement(Line, {
            key: line.lineId,
            ref: function ref(_ref2) {
              _this4['line' + line.lineId] = _ref2;
            },
            lineId: line.lineId,
            text: line.text,
            chords: line.chords,
            selected: selected,
            offset: offset,
            type: line.type,
            updateSelected: function updateSelected() {
              return _this4.updateSelected(line.lineId);
            },
            handleDelete: function handleDelete() {
              return _this4.handleDelete();
            }
          });
        } else if (line.type === 'recording') {
          return _react2.default.createElement(RecordingLine, {
            key: line.lineId,
            lineId: line.lineId
          });
        }

        return null;
      });
      return _react2.default.createElement(
        'div',
        {
          className: 'section',
          ref: function ref(_ref4) {
            _this4._section = _ref4;
          },
          name: this.props.sectionId,
          contentEditable: 'true',
          onPaste: function onPaste() {
            return _this4.handlePaste();
          },
          onKeyDown: function onKeyDown() {
            return _this4.handleKeyDown();
          },
          onKeyUp: function onKeyUp() {
            return _this4.handleKeyUp();
          },
          onFocus: function onFocus() {
            return _this4.handleOnFocus();
          },
          onBlur: function onBlur() {
            return _this4.handleOnBlur();
          },
          onClick: function onClick() {
            return _this4.handleOnClick();
          },
          onSelect: function onSelect() {
            return _this4.handleOnSelect();
          },
          onInput: function onInput() {
            return _this4.handleInput();
          },
          suppressContentEditableWarning: true
        },
        lineElements,
        _react2.default.createElement('div', { ref: function ref(_ref3) {
            _this4._tooltip = _ref3;
          }, className: 'tooltip-container' })
      );
    }
  }]);

  return Section;
}(_react.Component);

Section.propTypes = {
  lines: _react.PropTypes.arrayOf(_react.PropTypes.shape({})),
  section: _react.PropTypes.shape({
    lineData: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      lineId: _react.PropTypes.number
    })),
    offset: _react.PropTypes.number,
    selectedIndex: _react.PropTypes.number,
    selectedLine: _react.PropTypes.shape({
      lineId: _react.PropTypes.number
    })
  }).isRequired,
  sectionDispatch: _react.PropTypes.shape({
    addChord: _react.PropTypes.func.isRequired,
    addLine: _react.PropTypes.func.isRequired,
    deleteLine: _react.PropTypes.func.isRequired,
    initializeEditor: _react.PropTypes.func.isRequired,
    updateLines: _react.PropTypes.func.isRequired,
    updateSelected: _react.PropTypes.func.isRequired,
    updateText: _react.PropTypes.func.isRequired
  }).isRequired,
  sectionId: _react.PropTypes.number.isRequired,
  submitRevision: _react.PropTypes.func.isRequired
};


module.exports = Section;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextBlock = function (_Component) {
  _inherits(TextBlock, _Component);

  function TextBlock() {
    _classCallCheck(this, TextBlock);

    return _possibleConstructorReturn(this, (TextBlock.__proto__ || Object.getPrototypeOf(TextBlock)).apply(this, arguments));
  }

  _createClass(TextBlock, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "span",
        { className: "editor-text-block", "data-index": this.props.index },
        this.props.text
      );
    }
  }]);

  return TextBlock;
}(_react.Component);

exports.default = TextBlock;


TextBlock.propTypes = {
  text: _react.PropTypes.string.isRequired,
  index: _react.PropTypes.number.isRequired
};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = (_temp = _class = function (_Component) {
  _inherits(Tooltip, _Component);

  function Tooltip() {
    _classCallCheck(this, Tooltip);

    return _possibleConstructorReturn(this, (Tooltip.__proto__ || Object.getPrototypeOf(Tooltip)).apply(this, arguments));
  }

  _createClass(Tooltip, [{
    key: 'handleMouseDown',
    value: function handleMouseDown(handler, e) {
      handler();
      e.preventDefault();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var tooltipStyle = {
        position: 'absolute',
        top: this.props.rect.top - 30,
        left: this.props.rect.left
      };

      return _react2.default.createElement(
        'div',
        { ref: function ref(_ref) {
            _this2._tooltip = _ref;
          }, className: 'editor-tooltip', style: tooltipStyle },
        _react2.default.createElement(
          'div',
          { className: 'tooltip-option', onMouseDown: function onMouseDown() {
              return _this2.handleMouseDown(_this2.props.addRecordingLine);
            } },
          'Record'
        ),
        _react2.default.createElement(
          'div',
          { className: 'tooltip-option', onMouseDown: function onMouseDown() {
              return _this2.handleMouseDown(_this2.props.addChord);
            } },
          'Chord'
        )
      );
    }
  }]);

  return Tooltip;
}(_react.Component), _class.propTypes = {
  addChord: _react.PropTypes.func.isRequired,
  addRecordingLine: _react.PropTypes.func.isRequired,
  rect: _react.PropTypes.shape({
    top: _react.PropTypes.number,
    left: _react.PropTypes.number
  })
}, _temp);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _actions = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Editor = require('./editor/editor.jsx');
var AudioRecord = require('./record-audio-component');
var MessageComponent = require('./messaging/message-component');
var MessageFeed = require('./messaging/message-feed');
var AJAX = require('../ajax');

var _addChord = _actions.editorActions.addChord;
var _addLine = _actions.editorActions.addLine;
var _deleteLine = _actions.editorActions.deleteLine;
var _initializeEditor = _actions.editorActions.initializeEditor;
var _updateLines = _actions.editorActions.updateLines;
var _updateSelected = _actions.editorActions.updateSelected;
var _updateText = _actions.editorActions.updateText;


var socket = void 0;

var mapStateToProps = function mapStateToProps(state) {
  return state;
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    editorDispatch: {
      initialState: function initialState(userId, documentId) {
        dispatch({
          type: 'INITIAL_STATE',
          userId: userId,
          documentId: documentId
        });
      },
      pageMessages: function pageMessages(response) {
        dispatch({
          type: 'PAGE_MESSAGES',
          response: response
        });
      },
      newMessage: function newMessage(message) {
        dispatch({
          type: 'RECEIVE_MESSAGE',
          userId: message.userId,
          contextId: message.documentId,
          content: message.message,
          id: message.id
        });
      }
    },
    sectionDispatch: {
      addLine: function addLine(sectionId, lineId, index, type, text, shouldUpdateIndex, offset) {
        return dispatch(_addLine(sectionId, lineId, index, type, text, shouldUpdateIndex, offset));
      },
      deleteLine: function deleteLine(sectionId, index) {
        return dispatch(_deleteLine(sectionId, index));
      },
      initializeEditor: function initializeEditor(sectionData) {
        return dispatch(_initializeEditor(sectionData));
      },
      updateLines: function updateLines(sectionId, lineActions, selectedIndex, offset) {
        return dispatch(_updateLines(sectionId, lineActions, selectedIndex, offset));
      },
      updateSelected: function updateSelected(sectionId, index, offset) {
        return dispatch(_updateSelected(sectionId, index, offset));
      },
      updateText: function updateText(sectionId, lineId, text, offset) {
        return dispatch(_updateText(sectionId, lineId, text, offset));
      },
      addChord: function addChord(sectionId, lineId, text, index, updateSelectedFunction) {
        return dispatch(_addChord(sectionId, lineId, text, index, updateSelectedFunction));
      }
    }
  };
};

var EditorController = function (_Component) {
  _inherits(EditorController, _Component);

  function EditorController(props, context) {
    _classCallCheck(this, EditorController);

    var _this = _possibleConstructorReturn(this, (EditorController.__proto__ || Object.getPrototypeOf(EditorController)).call(this, props, context));

    _this.state = _this.props;
    var initialState = window.__INITIAL_STATE__;

    _this.props.editorDispatch.initialState(initialState.userId, _this.props.routeParams.documentId);
    return _this;
  }

  _createClass(EditorController, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      socket = require('socket.io-client')('http://localhost:8080', { query: 'context=' + this.props.routeParams.documentId });

      socket.on('incoming', function (message) {
        _this2.handleNewMessage(message);
      });
      // this.unsubscribe = store.subscribe(() => { this.handleMessagesUpdate() })

      var lastIndex = this.state.messageApp.messages.length !== 0 ? this.state.messageApp.messages[this.state.messages.length - 1].id : 0;
      AJAX.get('/messages/' + this.state.messageApp.documentId + '/' + lastIndex, function (response) {
        _this2.props.editorDispatch.pageMessages(JSON.parse(response));
      });
    }

    /** handleMessagesUpdate() {
      this.setState(store.getState());
    }**/

  }, {
    key: 'handleNewMessage',
    value: function handleNewMessage(message) {
      this.props.editorDispatch.newMessage(message);
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(content) {
      socket.emit('message', {
        documentId: this.props.messageApp.documentId,
        message: content,
        userId: this.state.messageApp.userId
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        'div',
        { className: 'editor-container' },
        _react2.default.createElement(
          'div',
          { className: 'record' },
          _react2.default.createElement(AudioRecord, null)
        ),
        _react2.default.createElement(Editor, {
          sectionDispatch: this.props.sectionDispatch,
          routeParams: this.props.routeParams,
          sectionData: this.props.editor.sectionData
        }),
        _react2.default.createElement(
          'div',
          { className: 'messages-container' },
          _react2.default.createElement(
            'div',
            { className: 'messages-wrapper' },
            _react2.default.createElement(MessageFeed, {
              currenUserId: this.state.messageApp.userId,
              messages: this.state.messageApp.messages
            }),
            _react2.default.createElement(MessageComponent, { isEditor: true, sendMessage: function sendMessage(content) {
                _this3.sendMessage(content);
              } })
          )
        )
      );
    }
  }]);

  return EditorController;
}(_react.Component);

EditorController.propTypes = {
  editor: _react.PropTypes.shape({
    sectionData: _react.PropTypes.arrayOf(_react.PropTypes.shape({}))
  }),
  editorDispatch: _react.PropTypes.shape({
    initialState: _react.PropTypes.func.isRequired,
    pageMessages: _react.PropTypes.func.isRequired,
    newMessage: _react.PropTypes.func.isRequired
  }).isRequired,
  messageApp: _react.PropTypes.shape({
    documentId: _react.PropTypes.string
  }),
  routeParams: _react.PropTypes.shape({
    documentId: _react.PropTypes.string
  }),
  sectionDispatch: _react.PropTypes.shape({}).isRequired
};


module.exports = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(EditorController);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require("react");

module.exports = function (_React$Component) {
  _inherits(EventController, _React$Component);

  function EventController(props) {
    _classCallCheck(this, EventController);

    return _possibleConstructorReturn(this, (EventController.__proto__ || Object.getPrototypeOf(EventController)).call(this, props));
  }

  _createClass(EventController, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "event-controller-container" },
        this.props.children
      );
    }
  }]);

  return EventController;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');
var GoogleMaps = require('google-maps');
var EventsListView = require('./events-list-view');
var EventsMapView = require('./events-map-view');
var ajax = require('../../ajax');
var Google = void 0;

var left = { left: 0 };
var right = { right: 0 };

module.exports = function (_React$Component) {
  _inherits(BrowseEvents, _React$Component);

  function BrowseEvents(props) {
    _classCallCheck(this, BrowseEvents);

    var _this = _possibleConstructorReturn(this, (BrowseEvents.__proto__ || Object.getPrototypeOf(BrowseEvents)).call(this, props));

    _this.selectListView = _this._selectListView.bind(_this);
    _this.selectMapView = _this._selectMapView.bind(_this);

    _this.state = {
      mode: 'list',
      events: [],
      position: null
    };
    return _this;
  }

  _createClass(BrowseEvents, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (this.state.events.length !== 0) {
        return;
      }

      navigator.geolocation.getCurrentPosition(function (position) {
        ajax.Get('/api/events/nearby?lat=' + position.coords.latitude + '&lng=' + position.coords.longitude + '&radius=50', function (response) {
          _this2.setState({
            events: JSON.parse(response),
            position: position
          });
        });
      });
    }
  }, {
    key: '_selectListView',
    value: function _selectListView() {
      this.setState({
        mode: 'list'
      });
    }
  }, {
    key: '_selectMapView',
    value: function _selectMapView() {
      this.setState({
        mode: 'map'
      });
    }
  }, {
    key: 'renderView',
    value: function renderView() {
      if (this.state.mode === 'list') {
        return React.createElement(
          'div',
          { className: 'events-list-container' },
          React.createElement(EventsListView, { events: this.state.events })
        );
      }

      return React.createElement(
        'div',
        { className: 'events-map-container' },
        React.createElement(EventsMapView, { events: this.state.events })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'events-container' },
        React.createElement(
          'div',
          { className: 'view-toggle-bar' },
          React.createElement(
            'div',
            { className: 'toggle' },
            React.createElement(
              'div',
              { className: 'toggle__option list-view', onClick: this.selectListView },
              'List'
            ),
            React.createElement(
              'div',
              { className: 'toggle__option map-view', onClick: this.selectMapView },
              'Map'
            ),
            React.createElement('div', { className: 'toggle__option highlight', style: this.state.mode === 'list' ? left : right })
          )
        ),
        React.createElement(
          'div',
          { className: 'events-view' },
          this.renderView()
        )
      );
    }
  }]);

  return BrowseEvents;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');
var Moment = require('moment');

var minute = new Array(4).fill(0).map(function (value, index) {
  if (index === 0) {
    return '00';
  }
  return (index * 15).toString();
});
var hour = new Array(12).fill(0).map(function (value, index) {
  return (index + 1).toString();
});
var styles = '\n            .left-selector {\n              cursor: pointer;\n              float: left;\n              font-size: 12px;\n              padding: 0 10px;\n            }\n\n            .selector:hover {\n              color: #9ad2ff;\n            }\n\n            .right-selector {\n              cursor: pointer;\n              float: right;\n              font-size: 12px;\n              padding: 0 10px;\n            }\n\n            .calendar-popup {\n              -webkit-box-shadow: 0px 6px 15px -2px rgba(0,0,0,0.75);\n              -moz-box-shadow: 0px 6px 15px -2px rgba(0,0,0,0.75);\n              box-shadow: 0px 6px 15px -2px rgba(0,0,0,0.75);\n              width: 200px;\n            }\n\n            table {\n              font-size: 13px;\n              line-height: 20px;\n              padding: 4px;\n              text-align: center;\n              width: 100%;\n            }\n\n            td:hover {\n              box-shadow: 0 0 5px 1px rgba(154, 210, 255, 0.75);\n              cursor: pointer;\n            }\n\n            .time-error {\n              color: #D46A4A;\n              font-size: 11px;\n            }\n\n            .picker-container {\n              display: inline-flex;\n              width: 50%;\n            }\n\n            .select {\n              background: white;\n              background-image: url(/images/down-arrow.svg);\n              background-position-x: 90%;\n              background-position-y: 55%;\n              background-repeat: no-repeat;\n              background-size: 10px;\n              flex: 1;\n              height: 32px;\n              margin: 5px;\n              text-indent: 8px;\n              -webkit-appearance: none;\n            }\n          ';

var Calendar = function (_React$Component) {
  _inherits(Calendar, _React$Component);

  function Calendar(props) {
    _classCallCheck(this, Calendar);

    var _this = _possibleConstructorReturn(this, (Calendar.__proto__ || Object.getPrototypeOf(Calendar)).call(this, props));

    var date = _this.props.date ? _this.props.date : Moment();

    _this.state = {
      date: date.format('MM/DD/YYYY'),
      tooltipLeft: null,
      tooltipTop: null,
      showTooltipStartDate: false,
      showTooltipEndDate: false,
      activeDate: Moment().format('MM/DD/YYYY'),
      startDate: Moment().format('MM/DD/YYYY'),
      endDate: Moment().format('MM/DD/YYYY'),
      endHour: 7,
      startHour: 6,
      endMinute: '00',
      startMinute: '00',
      startKind: 'PM',
      endKind: 'PM',
      invalidTime: false
    };

    _this.onDateChange = _this._onDateChange.bind(_this);
    _this.onKeyDown = _this._onKeyDown.bind(_this);
    _this.onFocusStart = _this._onFocusStart.bind(_this);
    _this.onFocusEnd = _this._onFocusEnd.bind(_this);
    _this.closeTooltips = _this._closeTooltips.bind(_this);
    _this.forwardMonth = _this._forwardMonth.bind(_this);
    _this.backMonth = _this._backMonth.bind(_this);
    _this.selectDate = _this._selectDate.bind(_this);

    _this.windowResize = _this._windowResize.bind(_this);
    return _this;
  }

  _createClass(Calendar, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.windowResize();
      window.onresize = this.debounceResize.bind(this, this.windowResize);
      document.body.onclick = this.closeTooltips;
    }
  }, {
    key: 'debounceResize',
    value: function debounceResize(callback) {
      if (this.resizeCallbackTimeout !== 0) {
        return;
      }

      this.resizeCallbackTimeout = window.setTimeout(callback, 300);
    }
  }, {
    key: '_windowResize',
    value: function _windowResize() {
      var parentNode = ReactDOM.findDOMNode(this.refs.parent);
      this.resizeCallbackTimeout = 0;
      this.setState({
        parentWidth: parentNode.offsetWidth
      });
    }
  }, {
    key: '_selectDate',
    value: function _selectDate(event) {
      var day = event.target.innerHTML;
      var startHour = this.state.startHour;
      var endHour = this.state.endHour;
      var startMinute = this.state.startMinute;
      var endMinute = this.state.endMinute;
      var startKind = this.state.startKind;
      var endKind = this.state.endKind;
      var classes = event.target.classList;

      if (classes.contains('start-hour-picker')) {
        startHour = event.target.value;
      } else if (classes.contains('end-hour-picker')) {
        endHour = event.target.value;
      } else if (classes.contains('start-minute-picker')) {
        startMinute = event.target.value;
      } else if (classes.contains('end-minute-picker')) {
        endMinute = event.target.value;
      } else if (classes.contains('start-kind-picker')) {
        startKind = event.target.value;
      } else if (classes.contains('end-kind-picker')) {
        endKind = event.target.value;
      }

      var startTime = startHour + ':' + startMinute + ' ' + startKind;
      var endTime = endHour + ':' + endMinute + ' ' + endKind;

      var endDate = Moment(this.state.endDate + ' ' + endTime);
      var startDate = Moment(this.state.startDate + ' ' + startTime);
      var isValid = false;

      if (this.state.showTooltipEndDate) {
        endDate.date(day);
      } else if (this.state.showTooltipStartDate) {
        startDate.date(day);
      }

      if (endDate.isBefore(startDate)) {
        this.setState({
          invalidTime: true,
          errorMessage: 'The times you have selected are invalid.'
        });
      } else if (startDate.isBefore(Moment())) {
        this.setState({
          invalidTime: true,
          errorMessage: 'The time you have selected has already passed.'
        });
      } else {
        isValid = true;
        this.setState({
          invalidTime: false
        });
      }

      this.props.onChange({
        endDate: endDate.format('MM/DD/YYYY HH:mm A'),
        startDate: startDate.format('MM/DD/YYYY HH:mm A'),
        isValid: isValid
      });

      this.setState({
        endDate: endDate.format('MM/DD/YYYY'),
        startDate: startDate.format('MM/DD/YYYY'),
        endHour: endHour,
        startHour: startHour,
        endMinute: endMinute,
        startMinute: startMinute,
        endKind: endKind,
        startKind: startKind,
        showTooltipStartDate: false,
        showTooltipEndDate: false
      });
    }
  }, {
    key: '_backMonth',
    value: function _backMonth() {
      var activeDate = Moment(this.state.activeDate);
      activeDate.subtract(1, 'months');
      this.setState({
        activeDate: activeDate.toString(),
        startDate: this.state.showTooltipStartDate ? activeDate.toString() : this.state.startDate,
        endDate: this.state.showTooltipEndDate ? activeDate.toString() : this.state.endDate
      });
    }
  }, {
    key: '_forwardMonth',
    value: function _forwardMonth() {
      var activeDate = Moment(this.state.activeDate);
      activeDate.add(1, 'months');
      this.setState({
        activeDate: activeDate.toString(),
        startDate: this.state.showTooltipStartDate ? activeDate.format('MM/DD/YYYY') : this.state.startDate,
        endDate: this.state.showTooltipEndDate ? activeDate.format('MM/DD/YYYY') : this.state.endDate
      });
    }
  }, {
    key: '_closeTooltips',
    value: function _closeTooltips(event) {
      if (event.target.classList.contains('selector') || event.target.classList.contains('day') || event.target.classList.contains('calendar-popup') || event.target.classList.contains('calendar-date')) {
        return;
      }
      this.setState({
        showTooltipStartDate: false,
        showTooltipEndDate: false
      });
    }
  }, {
    key: '_onKeyDown',
    value: function _onKeyDown(event) {
      if (event.keyCode === 47 || event.keyCode === 92 || event.keyCode === 45 || event.keyCode === 189 || event.keyCode === 191 || event.keyCode === 220) {
        event.preventDefault();
      }
    }
  }, {
    key: '_onFocusStart',
    value: function _onFocusStart(event) {
      this.setState({
        activeDate: this.state.startDate,
        tooltipTop: event.target.offsetTop + 30,
        tooltipLeft: event.target.offsetLeft + 30,
        showTooltipStartDate: true
      });
      return;
    }
  }, {
    key: '_onFocusEnd',
    value: function _onFocusEnd(event) {
      this.setState({
        activeDate: this.state.endDate,
        tooltipTop: event.target.offsetTop + 30,
        tooltipLeft: event.target.offsetLeft + 30,
        showTooltipEndDate: true
      });
      return;
    }
  }, {
    key: '_onDateChange',
    value: function _onDateChange(event) {
      var value = event.target.value;
      var date = Moment();
      var prevValue = this.state.activeDate;

      if (prevValue.length > value.length) {
        if (event.target.classList.contains('start')) {
          this.setState({
            startDate: value
          });
        } else {
          this.setState({
            endDate: value
          });
        }

        return;
      }

      if (value.match(/[A-Za-z]/)) {
        value = value.replace(value.match(/[A-Za-z]/)[0], '');
      }

      if (value.length === 1) {
        if (parseInt(value[0]) > 1) {
          value = '0' + value + '/';
        }
      }

      if (value.length === 2) {
        if (parseInt(value[0]) > 2) {
          value = '0' + value[0] + '/' + value[1];
        } else {
          value = value + '/';
        }
      }

      if (value.length === 4) {
        if (parseInt(value[3]) > 3) {
          value = value.substring(0, 3) + '0' + value[3];
        }
      }

      if (value.length === 5) {
        value = value + '/';
      }

      if (value.length === 10) {
        date = Moment(value, 'MM/DD/YYYY'); // +-HH:mm A
      }

      if (value.length === 11) {
        value = value.substring(0, 10);
      }

      if (event.target.classList.contains('start')) {
        this.setState({
          startDate: value,
          activeDate: date.format('MM/DD/YYYY')
        });
      } else {
        this.setState({
          endDate: value,
          activeDate: date.format('MM/DD/YYYY')
        });
      }
    }
  }, {
    key: 'renderTimeError',
    value: function renderTimeError() {
      return React.createElement(
        'div',
        { className: 'time-error' },
        this.state.errorMessage
      );
    }
  }, {
    key: 'renderMonth',
    value: function renderMonth() {
      var _this2 = this;

      var date = Moment(this.state.activeDate);
      date.date(1);
      var month = date.month();
      var weekday = date.day();
      date.subtract(weekday, 'days');
      var rowNum = weekday > 4 && Moment(this.state.activeDate).daysInMonth() === 31 || weekday === 6 && Moment(this.state.activeDate).daysInMonth() === 30 ? 6 : 5;
      var rows = new Array(rowNum).fill(0).map(function (zero, index) {
        return React.createElement(
          'tr',
          { key: index + 'week', className: 'calendar-week' },
          new Array(7).fill(0).map(function (fill, weekday) {
            var day = date.date();
            if (day > weekday && index === 0) {
              date.add(1, 'days');
              return React.createElement(
                'td',
                { className: 'day', key: day, onClick: _this2.backMonth, style: { color: '#ccc' } },
                day
              );
            }

            if (date.month() > month) {
              date.add(1, 'days');
              return React.createElement(
                'td',
                { className: 'day', key: day, onClick: _this2.forwardMonth, style: { color: '#ccc' } },
                day
              );
            }

            date.add(1, 'days');
            return React.createElement(
              'td',
              { className: 'day', key: day, onClick: _this2.selectDate },
              day
            );
          })
        );
      });

      return React.createElement(
        'table',
        null,
        React.createElement(
          'tbody',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              { colSpan: '7' },
              React.createElement(
                'span',
                { className: 'left-selector selector', onClick: this.backMonth },
                '<'
              ),
              React.createElement(
                'span',
                null,
                Moment(this.state.activeDate).format('MMMM') + ' ' + Moment(this.state.activeDate).format('YYYY')
              ),
              React.createElement(
                'span',
                { className: 'right-selector selector', onClick: this.forwardMonth },
                '>'
              )
            )
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              'S'
            ),
            React.createElement(
              'th',
              null,
              'M'
            ),
            React.createElement(
              'th',
              null,
              'T'
            ),
            React.createElement(
              'th',
              null,
              'W'
            ),
            React.createElement(
              'th',
              null,
              'TH'
            ),
            React.createElement(
              'th',
              null,
              'F'
            ),
            React.createElement(
              'th',
              null,
              'S'
            )
          ),
          rows
        )
      );
    }
  }, {
    key: 'renderCalendarPopup',
    value: function renderCalendarPopup() {
      return React.createElement(
        'div',
        { className: 'calendar-popup', style: { background: 'white', position: 'absolute', top: this.state.tooltipTop + 'px', left: this.state.tooltipLeft + 'px', padding: '4px', textAlign: 'center' } },
        this.renderMonth()
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'calendar-date-picker-container', ref: 'parent', onClick: this.closeTooltips },
        this.state.invalidTime ? this.renderTimeError() : null,
        React.createElement('input', { className: 'calendar-date start', style: this.state.parentWidth < 300 ? { width: '100%' } : { width: '50%' }, value: this.state.startDate, onChange: this.onDateChange, onFocus: this.onFocusStart, onKeyDown: this.onKeyDown, placeholder: 'MM/DD/YYYY', ref: 'startDate' }),
        this.state.showTooltipStartDate ? this.renderCalendarPopup() : null,
        React.createElement(
          'div',
          { className: 'picker-container', onClick: this.closeTooltips, style: this.state.parentWidth < 300 ? { display: 'flex', width: '100%' } : { display: 'inline-flex', width: '50%' } },
          React.createElement(
            'select',
            { value: this.state.startHour, onChange: this.selectDate, className: 'start-hour-picker select' },
            hour.map(function (time) {
              return React.createElement(
                'option',
                { key: time + '-hour-start', value: time },
                time
              );
            })
          ),
          React.createElement(
            'select',
            { value: this.state.startMinute, onChange: this.selectDate, className: 'start-minute-picker select' },
            minute.map(function (time) {
              return React.createElement(
                'option',
                { key: time + '-minute-start', value: time },
                time
              );
            })
          ),
          React.createElement(
            'select',
            { value: this.state.startKind, onChange: this.selectDate, className: 'start-kind-picker select' },
            React.createElement(
              'option',
              { value: 'AM' },
              'AM'
            ),
            React.createElement(
              'option',
              { value: 'PM' },
              'PM'
            )
          )
        ),
        React.createElement('input', { className: 'calendar-date', style: this.state.parentWidth < 300 ? { width: '100%' } : { width: '50%' }, value: this.state.endDate, onChange: this.onDateChange, onFocus: this.onFocusEnd, onKeyDown: this.onKeyDown, placeholder: 'MM/DD/YYYY', ref: 'startDate' }),
        this.state.showTooltipEndDate ? this.renderCalendarPopup() : null,
        React.createElement(
          'div',
          { className: 'picker-container', onClick: this.closeTooltips, style: this.state.parentWidth < 300 ? { display: 'flex', width: '100%' } : { display: 'inline-flex', width: '50%' } },
          React.createElement(
            'select',
            { value: this.state.endHour, onChange: this.selectDate, className: 'end-hour-picker select' },
            hour.map(function (time) {
              return React.createElement(
                'option',
                { key: time + '-hour-end', value: time },
                time
              );
            })
          ),
          React.createElement(
            'select',
            { value: this.state.endMinute, onChange: this.selectDate, className: 'end-minute-picker select' },
            minute.map(function (time) {
              return React.createElement(
                'option',
                { key: time + '-minute-end', value: time },
                time
              );
            })
          ),
          React.createElement(
            'select',
            { value: this.state.endKind, onChange: this.selectDate, className: 'end-kind-picker select' },
            React.createElement(
              'option',
              { value: 'AM' },
              'AM'
            ),
            React.createElement(
              'option',
              { value: 'PM' },
              'PM'
            )
          )
        ),
        React.createElement(
          'style',
          null,
          styles
        )
      );
    }
  }]);

  return Calendar;
}(React.Component);

Calendar.propTypes = {
  onChange: React.PropTypes.func.isRequired
};

module.exports = Calendar;
'use strict';
'use-strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');
var GoogleMaps = require('google-maps');
var Calendar = require('./calendar');
GoogleMaps.LIBRARIES = ['geometry', 'places', 'controls'];
var Moment = require('moment');
var ajax = require('../../ajax');
var Google = void 0;

module.exports = function (_React$Component) {
  _inherits(CreateEvent, _React$Component);

  function CreateEvent(props) {
    _classCallCheck(this, CreateEvent);

    var _this = _possibleConstructorReturn(this, (CreateEvent.__proto__ || Object.getPrototypeOf(CreateEvent)).call(this, props));

    _this.state = {
      loading: true,
      startDate: Moment().hour(18).minute(0),
      endDate: Moment().hour(19).minute(0),
      dateIsValid: true,
      positionSet: false,
      eventName: '',
      nameSet: false,
      notes: ''
    };

    _this.handleDateChange = _this._handleDateChange.bind(_this);
    _this.changeName = _this._changeName.bind(_this);
    _this.createEvent = _this._createEvent.bind(_this);
    return _this;
  }

  _createClass(CreateEvent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      navigator.geolocation.getCurrentPosition(function (position) {
        GoogleMaps.load(function (google) {
          Google = google;

          var map = new Google.maps.Map(document.getElementById('map'), {
            center: { lat: position.coords.latitude, lng: position.coords.longitude },
            zoom: 10
          });

          _this2.setState({
            loading: false
          });

          var input = ReactDOM.findDOMNode(_this2.refs.searchBox);
          var searchBox = new google.maps.places.SearchBox(input);

          var autocomplete = new google.maps.places.Autocomplete(input);
          autocomplete.bindTo('bounds', map);

          //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
          // Bias the SearchBox results towards current map's viewport.
          map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
          });

          var markers = [];
          // Listen for the event fired when the user selects a prediction and retrieve
          // more details for that place.
          searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();

            if (places.length === 0) {
              return;
            }

            // Clear out the old markers.
            markers.forEach(function (marker) {
              marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
              var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(30, 30)
              };

              var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
              });

              // Create a marker for each place.
              markers.push(marker);
              _this2.setState({
                eventLatitude: place.geometry.location.lat(),
                eventLongitude: place.geometry.location.lng(),
                positionSet: true
              });

              if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });

            map.fitBounds(bounds);

            if (map.getZoom() > 18) {
              map.setZoom(18);
            }
          });
        });
      });
    }
  }, {
    key: '_createEvent',
    value: function _createEvent() {
      ajax.Post('/api/events/create', JSON.stringify(this.state), function (eventId) {
        window.location.pathname = '/api/events?eventId=' + eventId.lastval;
      });
    }
  }, {
    key: '_changeName',
    value: function _changeName(event) {
      if (event.target.value.trim().length === 0) {
        this.setState({
          nameSet: false
        });

        return;
      }

      this.setState({
        nameSet: true,
        eventName: event.target.value.trim()
      });
    }
  }, {
    key: '_handleDateChange',
    value: function _handleDateChange(value) {
      this.setState({
        startDate: value.startDate,
        endDate: value.endDate,
        dateIsValid: value.isValid
      });
    }
  }, {
    key: 'renderLoader',
    value: function renderLoader() {
      return React.createElement(
        'div',
        { className: 'loader' },
        React.createElement('div', { className: 'spinner' })
      );
    }
  }, {
    key: 'renderComponent',
    value: function renderComponent() {
      return React.createElement(
        'div',
        { className: 'event-form' },
        React.createElement(
          'div',
          { className: 'event-form-wrapper' },
          React.createElement(
            'label',
            { 'for': 'name' },
            'Name'
          ),
          React.createElement('input', { name: 'name', className: 'event-name', onChange: this.changeName, type: 'text', placeholder: 'Name' }),
          React.createElement(
            'label',
            null,
            'Date'
          ),
          React.createElement(Calendar, { onChange: this.handleDateChange }),
          React.createElement(
            'label',
            { 'for': 'location' },
            'Location'
          ),
          React.createElement('input', { name: 'location', className: 'map-search', ref: 'searchBox', type: 'text', placeholder: 'Search Box' }),
          React.createElement(
            'label',
            { 'for': 'notes' },
            'Notes'
          ),
          React.createElement('textarea', { name: 'notes', className: 'event-notes', type: 'text', placeholder: 'Leave a note or description.' }),
          React.createElement(
            'button',
            { className: 'submit-event', onClick: this.createEvent, disabled: this.state.positionSet && this.state.nameSet && this.state.dateIsValid ? false : 'disabled' },
            'Submit'
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'create-event-container' },
        React.createElement('div', { id: 'map' }),
        this.state.loading ? this.renderLoader() : this.renderComponent()
      );
    }
  }]);

  return CreateEvent;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');
var Google = void 0;

module.exports = function (_React$Component) {
  _inherits(Event, _React$Component);

  function Event(props) {
    _classCallCheck(this, Event);

    var _this = _possibleConstructorReturn(this, (Event.__proto__ || Object.getPrototypeOf(Event)).call(this, props));

    _this.state = {
      event: props.event
    };
    return _this;
  }

  _createClass(Event, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'event-container' },
        React.createElement(
          'span',
          null,
          this.state.event.name
        ),
        React.createElement(
          'span',
          null,
          this.state.event.latitude,
          '+',
          this.state.event.longitude
        ),
        React.createElement(
          'span',
          null,
          this.state.event.notes
        )
      );
    }
  }]);

  return Event;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');
var Event = require('./event');
var Google = void 0;

module.exports = function (_React$Component) {
  _inherits(EventsListView, _React$Component);

  function EventsListView(props) {
    _classCallCheck(this, EventsListView);

    return _possibleConstructorReturn(this, (EventsListView.__proto__ || Object.getPrototypeOf(EventsListView)).call(this, props));
  }

  _createClass(EventsListView, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'events-list-container' },
        this.props.events.map(function (event) {
          return React.createElement(Event, { key: event.id, event: event });
        })
      );
    }
  }]);

  return EventsListView;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');
var EventsListView = require('./events-list-view');
var Event = require('./event');
var GoogleMaps = require('google-maps');
GoogleMaps.LIBRARIES = ['geometry', 'places', 'controls'];
var Google = void 0;

module.exports = function (_React$Component) {
  _inherits(EventsListView, _React$Component);

  function EventsListView(props) {
    _classCallCheck(this, EventsListView);

    return _possibleConstructorReturn(this, (EventsListView.__proto__ || Object.getPrototypeOf(EventsListView)).call(this, props));
  }

  _createClass(EventsListView, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      navigator.geolocation.getCurrentPosition(function (position) {
        GoogleMaps.load(function (google) {
          Google = google;

          var map = new Google.maps.Map(document.getElementById('map'), {
            center: { lat: position.coords.latitude, lng: position.coords.longitude },
            zoom: 10
          });

          _this2.setState({
            loading: false
          });

          var input = ReactDOM.findDOMNode(_this2.refs.searchBox);
          var searchBox = new google.maps.places.SearchBox(input);

          var autocomplete = new google.maps.places.Autocomplete(input);
          autocomplete.bindTo('bounds', map);

          //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
          // Bias the SearchBox results towards current map's viewport.
          map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
          });

          var markers = [];
          var bounds = new google.maps.LatLngBounds();
          _this2.props.events.forEach(function (event) {
            var icon = {
              url: 'https://maps.gstatic.com/mapfiles/ms2/micons/red.png',
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(30, 30)
            };

            var marker = new google.maps.Marker({
              map: map,
              icon: icon,
              title: event.name,
              position: { lat: parseFloat(event.latitude), lng: parseFloat(event.longitude) }
            });

            // Create a marker for each place.
            markers.push(marker);
          });

          // Listen for the event fired when the user selects a prediction and retrieve
          // more details for that place.
          searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();

            if (places.length === 0) {
              return;
            }

            // Clear out the old markers.
            markers.forEach(function (marker) {
              marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
          });
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'events-map-container' },
        React.createElement('input', { name: 'location', className: 'map-search', ref: 'searchBox', type: 'text', placeholder: 'Search Box' }),
        React.createElement('div', { id: 'map' }),
        React.createElement(
          'div',
          { className: 'events-list-container' },
          this.props.events.map(function (event) {
            console.log(event);
            return React.createElement(Event, { key: event.id, event: event });
          })
        )
      );
    }
  }]);

  return EventsListView;
}(React.Component);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var KeyCodes = exports.KeyCodes = {
  backspace: 8,
  enter: 13,
  shift: 16,
  control: 17,
  alt: 18,
  space: 32,
  upArrow: 38,
  downArrow: 40,
  c: 67,
  r: 82,
  s: 83
};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactRedux = require('react-redux');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _login = require('./auth/login.jsx');

var _login2 = _interopRequireDefault(_login);

var _register = require('./auth/register.jsx');

var _register2 = _interopRequireDefault(_register);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mapStateToProps = function mapStateToProps(state) {
  return {
    isAuthenticated: state.profile.id !== -1,
    userId: state.profile.id
  };
};

var HomeController = function (_Component) {
  _inherits(HomeController, _Component);

  function HomeController() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, HomeController);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = HomeController.__proto__ || Object.getPrototypeOf(HomeController)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      showUserOptions: false
    }, _this.flipped = false, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(HomeController, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      document.body.onclick = function (event) {
        _this2.bodyClickListener(event);
      };
    }
  }, {
    key: 'bodyClickListener',
    value: function bodyClickListener(event) {
      var parentNode = event.target.parentNode;

      if (event.target.className.indexOf('user-options-menu') !== -1 || event.target.className.indexOf('home') !== -1) {
        this.setState({
          showUserOptions: !this.state.showUserOptions
        });

        this.flipped = true;
        return;
      }

      if (event.target.className.indexOf('user-options') === -1) {
        while (parentNode != null) {
          if (parentNode.className && parentNode.className.indexOf('user-options') !== -1) {
            return;
          }
          parentNode = parentNode.parentNode;
        }

        this.setState({
          showUserOptions: false
        });
      }
    }
  }, {
    key: 'hideOverlay',
    value: function hideOverlay() {
      this.setState({
        showAccountDialog: false
      });
    }
  }, {
    key: 'showRegister',
    value: function showRegister() {
      this.setState({
        showAccountDialog: true,
        showSignInDialog: false
      });
    }
  }, {
    key: 'showSignIn',
    value: function showSignIn() {
      this.setState({
        showAccountDialog: true,
        showSignInDialog: true
      });
    }
  }, {
    key: 'showOptions',
    value: function showOptions() {
      if (this.flipped) {
        this.flipped = false;
        return;
      }
      this.setState({
        showUserOptions: true
      });
    }
  }, {
    key: 'registerUser',
    value: function registerUser() {
      return null;
    }
  }, {
    key: 'renderUserOptions',
    value: function renderUserOptions() {
      return _react2.default.createElement(
        'div',
        { className: 'user-options' },
        _react2.default.createElement(
          'a',
          { href: '/profile' },
          _react2.default.createElement(
            'div',
            { className: 'dropdown-button' },
            'Profile'
          )
        ),
        _react2.default.createElement(
          'a',
          { href: '/editor' },
          _react2.default.createElement(
            'div',
            { className: 'dropdown-button' },
            'Editor'
          )
        ),
        _react2.default.createElement(
          'a',
          { href: '/logout' },
          _react2.default.createElement(
            'div',
            { className: 'dropdown-button' },
            'Sign out'
          )
        )
      );
    }
  }, {
    key: 'renderAuthenticationOptions',
    value: function renderAuthenticationOptions() {
      var _this3 = this;

      if (this.props.isAuthenticated) {
        return _react2.default.createElement(
          'a',
          { className: 'user-options-menu', onClick: this.state.showUserOptions ? null : this.showOptions },
          _react2.default.createElement('div', { className: 'home' })
        );
      }

      return _react2.default.createElement(
        'a',
        { onClick: function onClick() {
            return _this3.showSignIn();
          } },
        _react2.default.createElement(
          'div',
          { className: 'signin-button' },
          'Sign in'
        )
      );
    }
  }, {
    key: 'renderSignInDialog',
    value: function renderSignInDialog() {
      var _this4 = this;

      return [_react2.default.createElement('div', { className: 'signin-background', onClick: function onClick() {
          return _this4.hideOverlay();
        } }), _react2.default.createElement(
        'div',
        { className: 'signin-dialog' },
        this.state.showSignInDialog ? _react2.default.createElement(_login2.default, { switchToRegister: function switchToRegister() {
            return _this4.showRegister();
          } }) : _react2.default.createElement(_register2.default, { registerUser: function registerUser() {
            return _this4.registerUser();
          }, switchToLogin: function switchToLogin() {
            return _this4.showSignIn();
          } })
      )];
    }
  }, {
    key: 'renderAccountRegistration',
    value: function renderAccountRegistration() {
      var _this5 = this;

      return _react2.default.createElement(
        'div',
        { className: 'account-registration' },
        _react2.default.createElement(
          'button',
          { className: 'register-button', onClick: function onClick() {
              return _this5.showRegister();
            } },
          'Register'
        ),
        _react2.default.createElement(
          'button',
          { className: 'signin-button', onClick: function onClick() {
              window.location.href = 'editor';
            } },
          'Try the Editor'
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'home-container' },
        _react2.default.createElement(
          'div',
          { className: 'navbar' },
          _react2.default.createElement(
            'a',
            { href: '/' },
            _react2.default.createElement(
              'div',
              { className: 'home-button' },
              'Noteable'
            )
          ),
          this.renderAuthenticationOptions(),
          this.state.showUserOptions ? this.renderUserOptions() : null,
          this.state.showAccountDialog ? this.renderSignInDialog() : null
        ),
        _react2.default.createElement(
          'div',
          { className: 'main-content' },
          _react2.default.createElement('div', { className: 'main-background' }),
          _react2.default.createElement(
            'div',
            { className: 'header' },
            _react2.default.createElement(
              'div',
              { className: 'header-container' },
              _react2.default.createElement(
                'h1',
                { className: 'header-container__title' },
                _react2.default.createElement(
                  'span',
                  { className: 'cursor' },
                  'Noteable. Be inspired'
                )
              ),
              _react2.default.createElement(
                'h5',
                { className: 'header-container__sub-title' },
                'Connect, Create, and Collaborate with artists near you.'
              ),
              this.props.isAuthenticated ? _react2.default.createElement('div', { className: 'account-registration' }) : this.renderAccountRegistration()
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'connect' },
            _react2.default.createElement('div', { className: 'graphic' }),
            _react2.default.createElement(
              'div',
              { className: 'content' },
              _react2.default.createElement(
                'h1',
                null,
                'Connect'
              ),
              _react2.default.createElement(
                'div',
                null,
                'Meet other aspiring songwriters as you grow your network. Get to know established or new songwriters and start creating content together right away.'
              ),
              _react2.default.createElement(
                'div',
                null,
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat. Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper. Nullam ullamcorper nisi non libero laoreet, id pulvinar augue sodales. Suspendisse hendrerit venenatis mattis.'
              ),
              _react2.default.createElement(
                'div',
                null,
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat. Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper.'
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'collaborate' },
            _react2.default.createElement(
              'div',
              { className: 'content' },
              _react2.default.createElement(
                'h1',
                null,
                'Collaborate'
              ),
              _react2.default.createElement(
                'div',
                null,
                'Meet other aspiring songwriters as you grow your network. Get to know established or new songwriters and start creating content together right away.'
              ),
              _react2.default.createElement(
                'div',
                null,
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat. Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper. Nullam ullamcorper nisi non libero laoreet, id pulvinar augue sodales. Suspendisse hendrerit venenatis mattis.'
              ),
              _react2.default.createElement(
                'div',
                null,
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat. Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper.'
              )
            ),
            _react2.default.createElement('div', { className: 'graphic' })
          ),
          _react2.default.createElement(
            'div',
            { className: 'create' },
            _react2.default.createElement('div', { className: 'graphic' }),
            _react2.default.createElement(
              'div',
              { className: 'content' },
              _react2.default.createElement(
                'h1',
                null,
                'Create'
              ),
              _react2.default.createElement(
                'div',
                null,
                'Meet other aspiring songwriters as you grow your network. Get to know established or new songwriters and start creating content together right away.'
              ),
              _react2.default.createElement(
                'div',
                null,
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat. Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper. Nullam ullamcorper nisi non libero laoreet, id pulvinar augue sodales. Suspendisse hendrerit venenatis mattis.'
              ),
              _react2.default.createElement(
                'div',
                null,
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat. Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper.'
              )
            )
          ),
          _react2.default.createElement(
            'a',
            { href: '/contact' },
            _react2.default.createElement(
              'div',
              { className: 'signin-button contact', style: { 'margin-right': '10px' } },
              'Contact Us'
            )
          )
        )
      );
    }
  }]);

  return HomeController;
}(_react.Component);

module.exports = (0, _reactRedux.connect)(mapStateToProps)(HomeController);
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CameraIcon = CameraIcon;
exports.CogIcon = CogIcon;
exports.CrossIcon = CrossIcon;
exports.OtherPencilIcon = OtherPencilIcon;
exports.PencilIcon = PencilIcon;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createElement = _react2.default.createElement;

function CameraIcon() {
  return createElement('svg', { width: '16', height: '16', viewBox: '0 0 16 16' }, createElement('path', { d: 'M4.75 9.5a3.25 3.25 0 1 0 6.5 0 3.25 3.25 0 0 0-6.5 0zM15 4h-3.5c-.25-1-.5-2-1.5-2H6C5 2 4.75 3 4.5 4H1a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm-7 9.94a4.44 4.44 0 1 1 0-8.88 4.44 4.44 0 0 1 0 8.88zM15 7h-2V6h2v1z' }));
}

function CogIcon() {
  return createElement('svg', { width: '16', height: '16', viewBox: '0 0 16 16' }, createElement('path', { d: 'M14.59 9.54a3.05 3.05 0 0 1 1.13-4.17l-1.58-2.72A3.05 3.05 0 0 1 9.57 0H6.43a3.05 3.05 0 0 1-4.58 2.64L.28 5.36a3.05 3.05 0 0 1 0 5.28l1.58 2.72A3.05 3.05 0 0 1 6.42 16h3.15a3.05 3.05 0 0 1 4.57-2.63l1.57-2.72a3 3 0 0 1-1.12-1.12zM8 11.23a3.24 3.24 0 1 1 0-6.48 3.24 3.24 0 0 1 0 6.48z' }));
}

function CrossIcon() {
  return createElement('svg', { width: '16', height: '16', viewBox: '0 0 16 16' }, createElement('path', { d: 'M15.85 12.85L11 8l4.85-4.85a.5.5 0 0 0 0-.7L13.56.14a.5.5 0 0 0-.7 0L8 5 3.15.15a.5.5 0 0 0-.7 0L.14 2.44a.5.5 0 0 0 0 .7L5 8 .15 12.85a.5.5 0 0 0 0 .7l2.29 2.3a.5.5 0 0 0 .7 0L8 11l4.85 4.85a.5.5 0 0 0 .7 0l2.3-2.29a.5.5 0 0 0 0-.7z' }));
}

function OtherPencilIcon() {
  return createElement('svg', { viewBox: '0 0 80 60', fillRule: 'evenodd', clipRule: 'evenodd', strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: '1.41' }, createElement('path', { strokeWidth: '.91', stroke: '#000', d: 'M32.13 6.13H40v34.92h-7.87z', transform: 'matrix(.88634 .56292 -.61638 .97052 21.9 -13.76)' }), createElement('path', { d: 'M40 2.75a.75.75 0 0 0-.75-.75h-6.5a.75.75 0 0 0-.75.75V5h8V2.75z', strokeWidth: '.75', stroke: '#000', transform: 'matrix(.87226 .55398 -.84354 1.32819 24.17 -16.08)' }), createElement('path', { d: 'M36 43l3.9 6.83c.02.03.02.08 0 .11a.14.14 0 0 1-.12.06h-7.54a.15.15 0 0 1-.12-.06.12.12 0 0 1-.01-.13L36 43z', strokeWidth: '.91', stroke: '#000', transform: 'matrix(-.87226 -.55398 .61965 -.97566 28.76 115.42)' }), createElement('path', { d: 'M48.03 16.02l-.2.73-.28.7-.18.38-.2.37-.68 1.04-.83 1.3-2.1 3.24-2.48 3.81-2.67 4.1-5.15 7.88-3.58 5.47-.65.98-.02.03-.03-.02-.03-.02.02-.03.61-1L33 39.4l4.92-8.02 2.56-4.17 2.39-3.88 2.02-3.27.82-1.31.66-1.05.24-.35.26-.32.52-.55.58-.5.06.04z', fill: '#fff' }));
}

function PencilIcon() {
  return createElement('svg', { viewBox: '0 0 80 60', fillRule: 'evenodd', clipRule: 'evenodd', strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: '1.41' }, createElement('path', { strokeWidth: '.91', stroke: '#000', d: 'M32.13 6.13H40v34.92h-7.87z', transform: 'matrix(.88634 .56292 -.61638 .97052 21.9 -13.76)' }), createElement('path', { d: 'M40 2.75a.75.75 0 0 0-.75-.75h-6.5a.75.75 0 0 0-.75.75V5h8V2.75z', strokeWidth: '.75', stroke: '#000', transform: 'matrix(.87226 .55398 -.84354 1.32819 24.17 -16.08)' }), createElement('path', { d: 'M36 43l3.9 6.83c.02.03.02.08 0 .11a.14.14 0 0 1-.12.06h-7.54a.15.15 0 0 1-.12-.06.12.12 0 0 1-.01-.13L36 43z', strokeWidth: '.91', stroke: '#000', transform: 'matrix(-.87226 -.55398 .61965 -.97566 27.62 117.26)' }));
}
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');
var MessageFeed = require('./message-feed');

module.exports = function (_React$Component) {
  _inherits(MessageComponent, _React$Component);

  function MessageComponent(props, context) {
    _classCallCheck(this, MessageComponent);

    var _this = _possibleConstructorReturn(this, (MessageComponent.__proto__ || Object.getPrototypeOf(MessageComponent)).call(this, props, context));

    _this.state = {
      messageText: ''
    };
    return _this;
  }

  _createClass(MessageComponent, [{
    key: 'keyDown',
    value: function keyDown(event) {
      if (event.keyCode === 13) {
        event.preventDefault();

        if (this.state.messageText.length > 0) {
          this.props.sendMessage(this.state.messageText);
          ReactDOM.findDOMNode(this.refs.messageEditor).value = '';
        }

        return;
      }
    }
  }, {
    key: 'setText',
    value: function setText(event) {
      if (this.state.messageText === event.target.value) {
        return;
      }

      this.setState({
        messageText: event.target.value
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement('textarea', { className: 'message-reply-editor',
        onInput: function onInput(event) {
          _this2.setText(event);
        },
        onKeyDown: function onKeyDown(event) {
          _this2.keyDown(event);
        },
        placeholder: 'Write a message',
        ref: 'messageEditor' });
    }
  }]);

  return MessageComponent;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

module.exports = function (_React$Component) {
  _inherits(MessageFeed, _React$Component);

  function MessageFeed(props) {
    _classCallCheck(this, MessageFeed);

    return _possibleConstructorReturn(this, (MessageFeed.__proto__ || Object.getPrototypeOf(MessageFeed)).call(this, props));
  }

  _createClass(MessageFeed, [{
    key: 'renderMessage',
    value: function renderMessage(message) {
      var classId = 'single-message';
      switch (message.collection) {
        case 'top':
          classId = 'top-message';
        case 'middle':
          classId = 'middle-message';
        case 'bottom':
          classId = 'bottom-message';
      }

      return React.createElement(
        'li',
        { className: 'message-feed__message message-collection ' + classId + ' ' + (message.userId === this.props.currentUserId ? 'message-feed__message--me' : '') },
        message.content
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        'ul',
        { className: 'message-feed' },
        this.props.messages.map(function (message) {
          return _this2.renderMessage(message);
        })
      );
    }
  }]);

  return MessageFeed;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _instruments = require('./instruments.json');

var _instruments2 = _interopRequireDefault(_instruments);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = (_temp = _class = function (_Component) {
  _inherits(ProfileCreate, _Component);

  function ProfileCreate() {
    _classCallCheck(this, ProfileCreate);

    return _possibleConstructorReturn(this, (ProfileCreate.__proto__ || Object.getPrototypeOf(ProfileCreate)).apply(this, arguments));
  }

  _createClass(ProfileCreate, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.savePreferences(this.props.profile.id);
    }
  }, {
    key: 'toggleInput',
    value: function toggleInput(instrument) {
      this.props.updateInstruments(instrument);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var instrumentList = _instruments2.default.instruments;
      var instrumentKeys = Object.keys(instrumentList);
      var stuff = this.props.profile.preferences.instruments;
      return _react2.default.createElement(
        'div',
        { className: 'app-container' },
        _react2.default.createElement(
          'div',
          { className: 'navbar' },
          _react2.default.createElement(
            'a',
            { href: '/' },
            _react2.default.createElement(
              'div',
              { className: 'home-button' },
              'Noteable'
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'edit-profile-container' },
          _react2.default.createElement(
            'h1',
            { className: 'edit-profile-container__header' },
            'Hey ',
            this.props.name,
            ', tell us a little bit about yourself'
          ),
          _react2.default.createElement(
            'div',
            { className: 'edit-profile-container__field__instruments--header' },
            'What instruments do you play?'
          ),
          _react2.default.createElement(
            'div',
            { className: 'edit-profile-container__field__instruments--submit-button', onClick: function onClick() {
                return _this2.props.savePreferences();
              } },
            'Next'
          ),
          _react2.default.createElement(
            'ul',
            { className: 'edit-profile-container__field__instruments' },
            instrumentKeys.map(function (key) {
              var instrument = instrumentList[key];

              return _react2.default.createElement(
                'li',
                { className: 'edit-profile-container__field__instruments--instrument', key: instrument, onClick: function onClick() {
                    return _this2.toggleInput(instrument);
                  } },
                _react2.default.createElement('input', {
                  className: 'edit-profile-container__field__instruments--instrument--checkbox',
                  type: 'checkbox',
                  name: instrument,
                  checked: stuff.indexOf(instrument) !== -1 ? instrument : null
                }),
                _react2.default.createElement(
                  'label',
                  { htmlFor: instrument },
                  instrument
                )
              );
            })
          )
        )
      );
    }
  }]);

  return ProfileCreate;
}(_react.Component), _class.propTypes = {
  name: _react.PropTypes.string.isRequired,
  profile: _react.PropTypes.shape({
    id: _react.PropTypes.number.isRequired,
    preferences: _react.PropTypes.shape({
      instruments: _react.PropTypes.arrayOf(_react.PropTypes.object)
    })
  }).isRequired,
  savePreferences: _react.PropTypes.func.isRequired,
  updateInstruments: _react.PropTypes.func.isRequired
}, _temp);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ajax = require('../../ajax');

var _ajax2 = _interopRequireDefault(_ajax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Profile = function (_React$Component) {
  _inherits(Profile, _React$Component);

  function Profile() {
    _classCallCheck(this, Profile);

    return _possibleConstructorReturn(this, (Profile.__proto__ || Object.getPrototypeOf(Profile)).apply(this, arguments));
  }

  _createClass(Profile, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'profile-three' },
          _react2.default.createElement('div', { className: 'navbar' }),
          _react2.default.createElement(
            'div',
            { className: 'profile-container' },
            _react2.default.createElement(
              'div',
              { className: 'user-info-container' },
              _react2.default.createElement('div', { className: 'darken' }),
              _react2.default.createElement(
                'div',
                { className: 'user-info__avatar' },
                _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4' })
              ),
              _react2.default.createElement(
                'div',
                { className: 'user-info' },
                _react2.default.createElement(
                  'div',
                  { className: 'user-info__username' },
                  'Michael Nakayama'
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'user-info__name' },
                  'Sportnak \u2022 '
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'user-info__location' },
                  'Bellingham, WA'
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'action-container' },
                  _react2.default.createElement(
                    'a',
                    { href: '#' },
                    _react2.default.createElement(
                      'div',
                      { className: 'action' },
                      'Follow'
                    )
                  ),
                  _react2.default.createElement(
                    'a',
                    { href: '#' },
                    _react2.default.createElement(
                      'div',
                      { className: 'action' },
                      'Message'
                    )
                  )
                )
              ),
              _react2.default.createElement(
                'div',
                { className: 'user-info-actions' },
                _react2.default.createElement('div', { className: 'after', style: { left: '50%' } }),
                _react2.default.createElement(
                  'a',
                  { className: 'user-info-actions__events', href: '#' },
                  _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                      'strong',
                      null,
                      '158'
                    ),
                    ' Events'
                  )
                ),
                _react2.default.createElement(
                  'a',
                  { className: 'user-info-actions__followers user-info-actions__active', href: '#' },
                  _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                      'strong',
                      null,
                      '2.4k'
                    ),
                    ' Followers'
                  )
                ),
                _react2.default.createElement(
                  'a',
                  { className: 'user-info-actions__following', href: '#' },
                  _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                      'strong',
                      null,
                      '152'
                    ),
                    ' Following'
                  )
                )
              )
            ),
            _react2.default.createElement(
              'ol',
              { className: 'information-container' },
              _react2.default.createElement(
                'li',
                { className: 'user' },
                _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-1/p320x320/11107741_10205918346213366_4095323511478631692_n.jpg?oh=924b4d2bc55deae8bd2357d1369093ed&oe=57B02620' }),
                _react2.default.createElement(
                  'div',
                  { className: 'user-information' },
                  _react2.default.createElement(
                    'div',
                    { className: 'user-information__name' },
                    _react2.default.createElement(
                      'strong',
                      null,
                      'Ian Mundy'
                    )
                  ),
                  _react2.default.createElement(
                    'div',
                    { classname: 'user-information__location' },
                    'Nashville, TN'
                  )
                )
              ),
              _react2.default.createElement(
                'li',
                { className: 'user' },
                _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4' })
              ),
              _react2.default.createElement(
                'li',
                { className: 'user' },
                _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-1/p320x320/11107741_10205918346213366_4095323511478631692_n.jpg?oh=924b4d2bc55deae8bd2357d1369093ed&oe=57B02620' }),
                _react2.default.createElement(
                  'div',
                  { className: 'user-information' },
                  _react2.default.createElement(
                    'div',
                    { className: 'user-information__name' },
                    _react2.default.createElement(
                      'strong',
                      null,
                      'Ian Mundy'
                    )
                  ),
                  _react2.default.createElement(
                    'div',
                    { classname: 'user-information__location' },
                    'Nashville, TN'
                  )
                )
              ),
              _react2.default.createElement(
                'li',
                { className: 'user' },
                _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-1/p320x320/11107741_10205918346213366_4095323511478631692_n.jpg?oh=924b4d2bc55deae8bd2357d1369093ed&oe=57B02620' }),
                _react2.default.createElement(
                  'div',
                  { className: 'user-information' },
                  _react2.default.createElement(
                    'div',
                    { className: 'user-information__name' },
                    _react2.default.createElement(
                      'strong',
                      null,
                      'Ian Mundy'
                    )
                  ),
                  _react2.default.createElement(
                    'div',
                    { classname: 'user-information__location' },
                    'Nashville, TN'
                  )
                )
              ),
              _react2.default.createElement(
                'li',
                { className: 'user' },
                _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-1/p320x320/11107741_10205918346213366_4095323511478631692_n.jpg?oh=924b4d2bc55deae8bd2357d1369093ed&oe=57B02620' }),
                _react2.default.createElement(
                  'div',
                  { className: 'user-information' },
                  _react2.default.createElement(
                    'div',
                    { className: 'user-information__name' },
                    _react2.default.createElement(
                      'strong',
                      null,
                      'Ian Mundy'
                    )
                  ),
                  _react2.default.createElement(
                    'div',
                    { classname: 'user-information__location' },
                    'Nashville, TN'
                  )
                )
              ),
              _react2.default.createElement(
                'li',
                { className: 'user' },
                _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4' })
              ),
              _react2.default.createElement(
                'li',
                { className: 'user' },
                _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4' })
              ),
              _react2.default.createElement(
                'li',
                { className: 'user' },
                _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4' })
              )
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'profile-two' },
          _react2.default.createElement('div', { className: 'navbar' }),
          _react2.default.createElement(
            'div',
            { className: 'profile-container' },
            _react2.default.createElement(
              'div',
              { className: 'user-info-container' },
              _react2.default.createElement(
                'div',
                { className: 'user-info__avatar' },
                _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4' })
              ),
              _react2.default.createElement(
                'div',
                { className: 'user-info' },
                _react2.default.createElement(
                  'div',
                  { className: 'user-info__username' },
                  'Michael Nakayama'
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'user-info__name' },
                  'Sportnak \u2022 '
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'user-info__location' },
                  'Bellingham, WA'
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'action-container' },
                  _react2.default.createElement(
                    'a',
                    { href: '#' },
                    _react2.default.createElement(
                      'div',
                      { className: 'action' },
                      'Follow'
                    )
                  ),
                  _react2.default.createElement(
                    'a',
                    { href: '#' },
                    _react2.default.createElement(
                      'div',
                      { className: 'action' },
                      'Message'
                    )
                  )
                )
              ),
              _react2.default.createElement(
                'div',
                { className: 'user-info-actions' },
                _react2.default.createElement('div', { className: 'after', style: { left: '50%' } }),
                _react2.default.createElement(
                  'a',
                  { className: 'user-info-actions__events', href: '#' },
                  _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                      'strong',
                      null,
                      '158'
                    ),
                    ' Events'
                  )
                ),
                _react2.default.createElement(
                  'a',
                  { className: 'user-info-actions__followers user-info-actions__active', href: '#' },
                  _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                      'strong',
                      null,
                      '2.4k'
                    ),
                    ' Followers'
                  )
                ),
                _react2.default.createElement(
                  'a',
                  { className: 'user-info-actions__following', href: '#' },
                  _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                      'strong',
                      null,
                      '152'
                    ),
                    ' Following'
                  )
                )
              ),
              _react2.default.createElement(
                'ol',
                { className: 'information-container' },
                _react2.default.createElement(
                  'li',
                  { className: 'user' },
                  _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-1/p320x320/11107741_10205918346213366_4095323511478631692_n.jpg?oh=924b4d2bc55deae8bd2357d1369093ed&oe=57B02620' }),
                  _react2.default.createElement(
                    'div',
                    { className: 'user-information' },
                    _react2.default.createElement(
                      'div',
                      { className: 'user-information__name' },
                      _react2.default.createElement(
                        'strong',
                        null,
                        'Ian Mundy'
                      )
                    ),
                    _react2.default.createElement(
                      'div',
                      { classname: 'user-information__location' },
                      'Nashville, TN'
                    )
                  )
                ),
                _react2.default.createElement(
                  'li',
                  { className: 'user' },
                  _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4' })
                ),
                _react2.default.createElement(
                  'li',
                  { className: 'user' },
                  _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-1/p320x320/11107741_10205918346213366_4095323511478631692_n.jpg?oh=924b4d2bc55deae8bd2357d1369093ed&oe=57B02620' }),
                  _react2.default.createElement(
                    'div',
                    { className: 'user-information' },
                    _react2.default.createElement(
                      'div',
                      { className: 'user-information__name' },
                      _react2.default.createElement(
                        'strong',
                        null,
                        'Ian Mundy'
                      )
                    ),
                    _react2.default.createElement(
                      'div',
                      { classname: 'user-information__location' },
                      'Nashville, TN'
                    )
                  )
                ),
                _react2.default.createElement(
                  'li',
                  { className: 'user' },
                  _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-1/p320x320/11107741_10205918346213366_4095323511478631692_n.jpg?oh=924b4d2bc55deae8bd2357d1369093ed&oe=57B02620' }),
                  _react2.default.createElement(
                    'div',
                    { className: 'user-information' },
                    _react2.default.createElement(
                      'div',
                      { className: 'user-information__name' },
                      _react2.default.createElement(
                        'strong',
                        null,
                        'Ian Mundy'
                      )
                    ),
                    _react2.default.createElement(
                      'div',
                      { classname: 'user-information__location' },
                      'Nashville, TN'
                    )
                  )
                ),
                _react2.default.createElement(
                  'li',
                  { className: 'user' },
                  _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-1/p320x320/11107741_10205918346213366_4095323511478631692_n.jpg?oh=924b4d2bc55deae8bd2357d1369093ed&oe=57B02620' }),
                  _react2.default.createElement(
                    'div',
                    { className: 'user-information' },
                    _react2.default.createElement(
                      'div',
                      { className: 'user-information__name' },
                      _react2.default.createElement(
                        'strong',
                        null,
                        'Ian Mundy'
                      )
                    ),
                    _react2.default.createElement(
                      'div',
                      { classname: 'user-information__location' },
                      'Nashville, TN'
                    )
                  )
                ),
                _react2.default.createElement(
                  'li',
                  { className: 'user' },
                  _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4' })
                ),
                _react2.default.createElement(
                  'li',
                  { className: 'user' },
                  _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4' })
                ),
                _react2.default.createElement(
                  'li',
                  { className: 'user' },
                  _react2.default.createElement('img', { src: 'https://scontent.fsnc1-1.fna.fbcdn.net/hprofile-xfp1/v/t1.0-1/p320x320/12472296_10156709861090621_8977337434395538039_n.jpg?oh=3266682a4859073eb14e4e86ccab8c1c&oe=57A69AE4' })
                )
              )
            ),
            _react2.default.createElement('div', { className: 'user-display-container' })
          )
        )
      );
    }
  }]);

  return Profile;
}(_react2.default.Component);

module.exports = Profile;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NavigationSidebar = function (_Component) {
  _inherits(NavigationSidebar, _Component);

  function NavigationSidebar() {
    _classCallCheck(this, NavigationSidebar);

    return _possibleConstructorReturn(this, (NavigationSidebar.__proto__ || Object.getPrototypeOf(NavigationSidebar)).apply(this, arguments));
  }

  _createClass(NavigationSidebar, [{
    key: 'focusSearch',
    value: function focusSearch(event) {
      event.target.placeholder = '';
    }
  }, {
    key: 'blurSearch',
    value: function blurSearch(event) {
      event.target.placeholder = 'Search';
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var activeTab = this.props.activeTab.length === 0 ? 'profile' : this.props.activeTab;

      return _react2.default.createElement(
        'div',
        { className: 'navigation-sidebar' },
        _react2.default.createElement(
          'div',
          { className: 'navigation-sidebar__content' },
          _react2.default.createElement(
            'div',
            { className: 'navigation-sidebar__content__filter-bar-container' },
            _react2.default.createElement('input', { className: 'navigation-sidebar__content__filter-bar', onFocus: function onFocus(event) {
                return _this2.focusSearch(event);
              }, onBlur: function onBlur(event) {
                return _this2.blurSearch(event);
              }, placeholder: 'Search' })
          ),
          _react2.default.createElement(
            'div',
            { className: 'navigation-sidebar__content__options' },
            _react2.default.createElement(
              'div',
              { className: 'navigation-sidebar__content__options--option ' + (activeTab.indexOf('profile') !== -1 || activeTab.length === 0 ? 'active-tab' : ''), onClick: function onClick(event) {
                  event.stopPropagation();_this2.props.navigate('profile');
                } },
              _react2.default.createElement(
                'div',
                null,
                'Home'
              ),
              activeTab.indexOf('profile') === -1 && activeTab.length !== 0 ? null : _react2.default.createElement(
                'div',
                { className: 'navigation-sidebar__content__options--option__suboptions' },
                _react2.default.createElement(
                  'div',
                  { className: 'navigation-sidebar__content__options--option__suboptions--option ' + (activeTab.indexOf('view') !== -1 ? 'active-tab' : ''), onClick: function onClick(event) {
                      event.stopPropagation();_this2.props.navigate('profileview');
                    } },
                  'Profile'
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'navigation-sidebar__content__options--option__suboptions--option ' + (activeTab.indexOf('settings') !== -1 ? 'active-tab' : ''), onClick: function onClick(event) {
                      event.stopPropagation();_this2.props.navigate('profilesettings');
                    } },
                  'Settings'
                )
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'navigation-sidebar__content__options--option ' + (activeTab === 'documents' ? 'active-tab' : ''), onClick: function onClick() {
                  return _this2.props.navigate('documents');
                } },
              'Documents'
            ),
            activeTab !== 'documents' ? null : _react2.default.createElement('div', { className: 'navigation-sidebar__content__options--option__sub-options' }),
            _react2.default.createElement(
              'div',
              { className: 'navigation-sidebar__content__options--option ' + (activeTab === 'messages' ? 'active-tab' : ''), onClick: function onClick() {
                  return _this2.props.navigate('messages');
                } },
              'Messages'
            ),
            _react2.default.createElement(
              'div',
              { className: 'navigation-sidebar__content__options--option ' + (activeTab === 'events' ? 'active-tab' : ''), onClick: function onClick() {
                  return _this2.props.navigate('events');
                } },
              'Events'
            ),
            activeTab !== 'events' ? null : _react2.default.createElement('div', { className: 'navigation-sidebar__content__options--option__sub-options' })
          )
        )
      );
    }
  }]);

  return NavigationSidebar;
}(_react.Component);

NavigationSidebar.propTypes = {
  activeTab: _react.PropTypes.string,
  navigate: _react.PropTypes.func.isRequired
};


module.exports = NavigationSidebar;
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _commonIcons = require('../icons/common-icons.g');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProfileSettings = function (_Component) {
  _inherits(ProfileSettings, _Component);

  function ProfileSettings() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ProfileSettings);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ProfileSettings.__proto__ || Object.getPrototypeOf(ProfileSettings)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      profile: _this.props.profile
    }, _this.saveDebounce = function (debounceFunc) {
      if (_this.changeTimeout != null) {
        window.clearTimeout(_this.changeTimeout);
      }

      _this.changeTimeout = window.setTimeout(function () {
        _this.changeTimeout = null;
        debounceFunc();
      }, 1000);
    }, _this.saveProfile = function () {
      _this.props.profileChange(_this.state.profile);
    }, _this.nameChange = function () {
      _this.setState({
        profile: _extends({}, _this.state.profile, {
          name: _this._name.value
        })
      });
    }, _this.professionChange = function () {
      _this.setState({
        profile: _extends({}, _this.state.profile, {
          profession: _this._profession.value
        })
      });
    }, _this.locationChange = function () {
      _this.setState({
        profile: _extends({}, _this.state.profile, {
          location: _this._location.value
        })
      });
    }, _this.changeAvatar = function (file) {
      _this.props.sendImageToServer(file, function (url) {
        _this.setState({
          profile: _extends({}, _this.state.profile, {
            avatarUrl: url
          })
        });
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ProfileSettings, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'profile-settings' },
        _react2.default.createElement(
          'div',
          { className: 'profile-settings__close-icon', onClick: function onClick() {
              return _this2.props.closeSettings();
            } },
          _react2.default.createElement(_commonIcons.CrossIcon, null)
        ),
        _react2.default.createElement(
          'form',
          { className: 'uploader', encType: 'multipart/form-data' },
          _react2.default.createElement('div', { className: 'profile-settings__avatar', style: { backgroundImage: 'url(\'' + this.state.profile.avatarUrl + '\'' } }),
          _react2.default.createElement(
            'div',
            { className: 'profile-settings__upload-button', onClick: function onClick() {
                _this2._file.click();
              } },
            _react2.default.createElement(_commonIcons.CameraIcon, null)
          ),
          _react2.default.createElement('input', { className: 'profile-settings__file-upload', ref: function ref(_ref2) {
              _this2._file = _ref2;
            }, type: 'file', name: 'file', onChange: function onChange() {
              return _this2.changeAvatar(_this2._file.files[0]);
            } })
        ),
        _react2.default.createElement(
          'div',
          { className: 'profile-settings__input-container' },
          _react2.default.createElement(
            'label',
            { htmlFor: 'name' },
            'Name: '
          ),
          _react2.default.createElement('input', {
            className: 'profile-settings__name',
            type: 'text',
            onChange: this.nameChange,
            placeholder: 'Like John Lennon or something',
            name: 'name',
            value: this.state.profile.name,
            ref: function ref(_ref3) {
              _this2._name = _ref3;
            }
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'profile-settings__input-container' },
          _react2.default.createElement(
            'label',
            { htmlFor: 'title' },
            'Profession: '
          ),
          _react2.default.createElement('input', {
            className: 'profile-settings__title',
            type: 'text',
            onChange: this.professionChange,
            placeholder: 'Student at Belmont or Lonnie\'s karaoke winner',
            name: 'title', value: this.state.profile.profession,
            ref: function ref(_ref4) {
              _this2._profession = _ref4;
            }
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'profile-settings__input-container' },
          _react2.default.createElement(
            'label',
            { htmlFor: 'location' },
            'Location: '
          ),
          _react2.default.createElement('input', {
            className: 'profile-settings__location',
            type: 'text',
            onChange: this.locationChange,
            placeholder: 'Location',
            name: 'location',
            value: this.state.profile.location,
            ref: function ref(_ref5) {
              _this2._location = _ref5;
            }
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'profile-settings__save', onClick: function onClick() {
              return _this2.saveProfile();
            } },
          'Save'
        )
      );
    }
  }]);

  return ProfileSettings;
}(_react.Component);

ProfileSettings.propTypes = {
  closeSettings: _react.PropTypes.func.isRequired,
  profile: _react.PropTypes.shape({
    avatarUrl: _react.PropTypes.string,
    name: _react.PropTypes.string,
    location: _react.PropTypes.string,
    profession: _react.PropTypes.string
  }),
  profileChange: _react.PropTypes.func.isRequired,
  sendImageToServer: _react.PropTypes.func.isRequired
};


module.exports = ProfileSettings;
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _draftJs = require('draft-js');

var _draftJsExportHtml = require('draft-js-export-html');

var _draftJsImportHtml = require('draft-js-import-html');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _ajax = require('../../ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _navigationSidebar = require('./navigation-sidebar.jsx');

var _navigationSidebar2 = _interopRequireDefault(_navigationSidebar);

var _profileSettings = require('./profile-settings.jsx');

var _profileSettings2 = _interopRequireDefault(_profileSettings);

var _commonIcons = require('../icons/common-icons.g');

var _actions = require('../../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _loadUser = _actions.profileActions.loadUser;
var _saveProfile = _actions.profileActions.saveProfile;
var _updateBio = _actions.profileActions.updateBio;
var _updateInstruments = _actions.profileActions.updateInstruments;
var _validateBio = _actions.profileActions.validateBio;


var mapStateToProps = function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    profile: state.profile,
    validation: state.validation
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    loadUser: function loadUser(userId) {
      return dispatch(_loadUser(userId));
    },
    saveProfile: function saveProfile(profile) {
      return dispatch(_saveProfile(profile));
    },
    updateBio: function updateBio(bio) {
      return dispatch(_updateBio(bio));
    },
    updateInstruments: function updateInstruments(instrument) {
      return dispatch(_updateInstruments(instrument));
    },
    validateBio: function validateBio(bio) {
      return dispatch(_validateBio(bio));
    }
  };
};

var Profile = function (_Component) {
  _inherits(Profile, _Component);

  function Profile() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Profile);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Profile.__proto__ || Object.getPrototypeOf(Profile)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      editorState: _this.props.profile.bio == null ? _draftJs.EditorState.createEmpty() : _draftJs.EditorState.createWithContent((0, _draftJsImportHtml.stateFromHTML)(_this.props.profile.bio)),
      isEditing: false,
      profile: _this.props.profile,
      settingsView: _this.props.location.hash.indexOf('settings') !== -1
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Profile, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        profile: nextProps.profile,
        settingsView: nextProps.location.hash.indexOf('settings') !== -1
      });
    }
  }, {
    key: 'onBioChange',
    value: function onBioChange(editorState) {
      this.setState({
        editorState: editorState
      });

      this.props.validateBio(editorState.getCurrentContent().getPlainText());
      this.props.updateBio((0, _draftJsExportHtml.stateToHTML)(editorState.getCurrentContent()));
    }
  }, {
    key: 'sendImageToServer',
    value: function sendImageToServer(file, callback) {
      var reader = new FileReader();

      reader.onload = function () {
        var dataUrl = reader.result;
        var base64 = dataUrl.split(',')[1];
        var formData = new FormData();
        formData.append(file.name, base64);

        _ajax2.default.postBlob('/user/edit/picture/new', formData, function (response) {
          callback(JSON.parse(response).cloudStoragePublicUrl);
        });
      };

      reader.readAsDataURL(file);

      event.preventDefault();
    }
  }, {
    key: 'navigate',
    value: function navigate(hashLocation) {
      if (window.location.hash === '#' + hashLocation) {
        window.location.hash = '';
      } else {
        window.location.hash = hashLocation;
      }
    }
  }, {
    key: 'saveBio',
    value: function saveBio() {
      var _this2 = this;

      var validstate = Object.keys(this.props.validation).filter(function (option) {
        return !_this2.props.validation[option];
      });

      if (validstate.length !== 0) {
        return;
      }

      this.props.saveProfile(this.props.profile);
      this.closeEditor();
    }
  }, {
    key: 'followUser',
    value: function followUser(userId) {
      _ajax2.default.post('/user/follow?userId=' + userId, null, function (response) {
        console.log(response);
      });
    }
  }, {
    key: 'profileChange',
    value: function profileChange(profile) {
      this.props.saveProfile(profile);
    }
  }, {
    key: 'closeEditor',
    value: function closeEditor() {
      this.setState({
        editorState: _draftJs.EditorState.createWithContent((0, _draftJsImportHtml.stateFromHTML)(this.props.profile.bio)),
        isEditing: false
      });
    }
  }, {
    key: 'changeCoverImage',
    value: function changeCoverImage(file) {
      var _this3 = this;

      this.sendImageToServer(file, function (url) {
        _this3.profileChange(_extends({}, _this3.props.profile, {
          coverImage: url
        }));
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      if (this.props.location.pathname.indexOf('create') !== -1) {
        return (0, _react.cloneElement)(this.props.children, _extends({}, this.props, this.state));
      }

      return _react2.default.createElement(
        'div',
        { className: 'app-container' },
        _react2.default.createElement('link', { rel: 'stylesheet', type: 'text/css', href: 'https://cdnjs.cloudflare.com/ajax/libs/draft-js/0.7.0/Draft.min.css' }),
        _react2.default.createElement(
          'div',
          { className: 'navbar navbar__no-home' },
          _react2.default.createElement(
            'a',
            { href: '/' },
            _react2.default.createElement(
              'div',
              { className: 'home-button' },
              'Noteable'
            )
          )
        ),
        this.state.settingsView ? _react2.default.createElement(_profileSettings2.default, {
          closeSettings: function closeSettings() {
            return _this4.navigate('profile');
          },
          profile: this.state.profile,
          profileChange: function profileChange(profile) {
            return _this4.profileChange(profile);
          },
          sendImageToServer: function sendImageToServer(event, callback) {
            return _this4.sendImageToServer(event, callback);
          }
        }) : _react2.default.createElement(
          'div',
          { className: 'profile-container' },
          _react2.default.createElement(
            'div',
            { className: 'profile-header' },
            _react2.default.createElement('div', { className: 'filter', style: { backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.45)), url("' + this.props.profile.coverImage + '")' } }),
            _react2.default.createElement(
              'div',
              { className: 'profile' },
              _react2.default.createElement(
                'span',
                { className: 'profile__edit-icon', onClick: function onClick() {
                    _this4.setState({ settingsView: true });_this4.navigate('profilesettings');
                  } },
                _react2.default.createElement(_commonIcons.CogIcon, null)
              ),
              _react2.default.createElement(
                'form',
                { className: 'uploader', encType: 'multipart/form-data' },
                _react2.default.createElement('input', { className: 'profile-settings__file-upload', ref: function ref(_ref2) {
                    _this4._coverImage = _ref2;
                  }, type: 'file', name: 'file', onChange: function onChange() {
                    return _this4.changeCoverImage(_this4._coverImage.files[0]);
                  } })
              ),
              _react2.default.createElement(
                'span',
                { className: 'profile__camera-icon', alt: 'Change cover image', onClick: function onClick() {
                    return _this4._coverImage.click();
                  } },
                _react2.default.createElement(_commonIcons.CameraIcon, null)
              ),
              _react2.default.createElement('div', { className: 'profile__image', style: { backgroundImage: 'url(\'' + this.props.profile.avatarUrl + '\'' } }),
              _react2.default.createElement(
                'div',
                { className: 'profile__name' },
                this.props.profile.name == null ? 'Michael Nakayama' : this.props.profile.name
              ),
              _react2.default.createElement(
                'div',
                { className: 'profile__title' },
                'Studying songwriting \u2022 Belmont University'
              ),
              _react2.default.createElement(
                'div',
                { className: 'profile__title' },
                '1 year experience'
              ),
              _react2.default.createElement(
                'div',
                { className: 'profile__location' },
                this.props.profile.location == null ? 'Bellingham, WA' : this.props.profile.location
              ),
              _react2.default.createElement(
                'button',
                { className: 'profile__follow', onClick: function onClick() {
                    return _this4.followUser(_this4.props.profile.id);
                  } },
                'Follow'
              ),
              _react2.default.createElement(
                'button',
                { className: 'profile__message' },
                'Message'
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'isLooking' },
              this.props.profile.isLooking == null ? 'I\'m looking to start a band!' : ''
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'profile-about__nav-bar' },
            _react2.default.createElement(
              'a',
              { href: '#about' },
              _react2.default.createElement(
                'button',
                null,
                'About'
              )
            ),
            _react2.default.createElement(
              'button',
              { href: '#interests' },
              'Interests'
            ),
            _react2.default.createElement(
              'button',
              { href: '#demos' },
              'My demos'
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'profile-about' },
            _react2.default.createElement(
              'div',
              { className: 'about-tab ' + (this.props.location.hash === 'about' || this.props.location.hash === '' ? 'about-tab--active' : '') },
              _react2.default.createElement(
                'div',
                { className: 'profile-about__title' },
                'About Me',
                _react2.default.createElement(
                  'span',
                  { className: 'profile-about__icon', onClick: function onClick() {
                      return _this4.setState({ isEditing: true });
                    } },
                  _react2.default.createElement(_commonIcons.PencilIcon, null)
                ),
                this.props.validation.isValidBio ? '' : _react2.default.createElement(
                  'span',
                  { className: 'error profile-about__error-message' },
                  'Your about section is too long.'
                )
              ),
              _react2.default.createElement(
                'div',
                { className: 'profile-about__container' },
                this.state.isEditing ? _react2.default.createElement(
                  'div',
                  { className: 'profile-about__container__actions' },
                  _react2.default.createElement(
                    'button',
                    { className: 'profile-about__container__actions--save', onClick: function onClick() {
                        return _this4.saveBio();
                      } },
                    'Save'
                  ),
                  _react2.default.createElement(
                    'button',
                    { className: 'profile-about__container__actions--cancel', onClick: function onClick() {
                        return _this4.closeEditor();
                      } },
                    'Cancel'
                  )
                ) : null,
                _react2.default.createElement(
                  'div',
                  { className: 'profile-about__editor-container ' + (this.state.isEditing ? 'profile-about__editor-container--is-editing' : '') },
                  _react2.default.createElement(_draftJs.Editor, {
                    editorState: this.state.editorState,
                    onChange: function onChange(editorState) {
                      return _this4.onBioChange(editorState);
                    },
                    placeholder: this.state.isEditing ? 'Tell the world who you are.' : '',
                    readOnly: !this.state.isEditing
                  })
                )
              )
            )
          )
        ),
        _react2.default.createElement(_navigationSidebar2.default, { activeTab: this.props.location.hash, navigate: function navigate(hashLocation) {
            return _this4.navigate(hashLocation);
          } })
      );
    }
  }]);

  return Profile;
}(_react.Component);

Profile.propTypes = {
  children: _react.PropTypes.object,
  createEditorState: _react.PropTypes.func,
  currentUser: _react.PropTypes.shape({
    isAuthenticated: _react.PropTypes.bool.isRequired,
    userId: _react.PropTypes.number.isRequired
  }),
  location: _react.PropTypes.shape({
    hash: _react.PropTypes.string
  }),
  loadUser: _react.PropTypes.func.isRequired,
  params: _react.PropTypes.object.isRequired,
  profile: _react.PropTypes.shape({
    avatarUrl: _react.PropTypes.string,
    bio: _react.PropTypes.string,
    coverImage: _react.PropTypes.string,
    id: _react.PropTypes.number.isRequired
  }),
  saveProfile: _react.PropTypes.func.isRequired,
  updateBio: _react.PropTypes.func.isRequired,
  validation: _react.PropTypes.shape({
    isValidBio: _react.PropTypes.bool.isRequired
  }),
  validateBio: _react.PropTypes.func.isRequired

};


module.exports = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Profile);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var RecordRTC = void 0;
var Moment = require('moment');
var recorder = void 0;

module.exports = function (_React$Component) {
  _inherits(AudioComponent, _React$Component);

  function AudioComponent(props) {
    _classCallCheck(this, AudioComponent);

    var _this = _possibleConstructorReturn(this, (AudioComponent.__proto__ || Object.getPrototypeOf(AudioComponent)).call(this, props));

    _this.state = { isRecording: false };
    return _this;
  }

  _createClass(AudioComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var mediaConstraints = {
        audio: {
          mandatory: {
            echoCancellation: true,
            googAutoGainControl: true,
            googNoiseSuppression: true,
            googHighpassFilter: true
          }
        }
      };
      RecordRTC = require('recordrtc');

      navigator.webkitGetUserMedia(mediaConstraints, this.successCallback, this.errorCallback);
    }
  }, {
    key: 'successCallback',
    value: function successCallback(stream) {
      var options = {
        bufferSize: 16384,
        type: 'audio',
        audioBitsPerSecond: 128000
      };

      recorder = RecordRTC(stream, options);
    }
  }, {
    key: 'errorCallback',
    value: function errorCallback(error) {
      window.alert(error);
    }
  }, {
    key: 'startRecording',
    value: function startRecording() {
      recorder.startRecording();
      this.setState({
        isRecording: true
      });
    }
  }, {
    key: 'stopRecording',
    value: function stopRecording() {
      var _this2 = this;

      recorder.stopRecording(function (audioURL) {
        var recordedBlob = recorder.getBlob();

        recorder.getDataURL(function (dataURL) {
          _this2.setState({
            audioUrl: audioURL,
            dataUrl: dataURL,
            blob: recordedBlob,
            isRecording: false
          });
        });

        _this2.recordButtonFunction = function () {
          _this2.startRecording();
        };
      });
    }
  }, {
    key: 'sendAudioToServer',
    value: function sendAudioToServer() {
      var reader = new FileReader();

      reader.onload = function () {
        var dataUrl = reader.result;
        var base64 = dataUrl.split(',')[1];
        var formData = new FormData();
        formData.append('name', 'testing.wav');
        formData.append('file', base64);

        var request = new XMLHttpRequest();
        request.open('POST', '/post-blob');
        request.send(formData);
      };

      reader.readAsDataURL(this.state.blob);
    }
  }, {
    key: 'renderGrid',
    value: function renderGrid() {
      return React.createElement(
        'div',
        null,
        React.createElement('div', { className: 'testing-vertical' }),
        React.createElement('div', { className: 'testing-horizontal' })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          null,
          React.createElement('div', { onClick: this.state.isRecording ? function () {
              _this3.stopRecording();
            } : function () {
              _this3.startRecording();
            }, className: 'record-button' }),
          React.createElement('div', { onClick: function onClick() {
              _this3.stopRecording();
            }, className: 'stop-button' }),
          React.createElement('audio', { src: this.state.audioUrl, className: 'audio-player', controls: true }),
          React.createElement(
            'button',
            { onClick: function onClick() {
                _this3.sendAudioToServer();
              } },
            'Send'
          )
        )
      );
    }
  }]);

  return AudioComponent;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _login = require('./auth/login.jsx');

var _login2 = _interopRequireDefault(_login);

var _register = require('./auth/register.jsx');

var _register2 = _interopRequireDefault(_register);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (_Component) {
  _inherits(SigninController, _Component);

  function SigninController() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SigninController);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SigninController.__proto__ || Object.getPrototypeOf(SigninController)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      isRegistering: false
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SigninController, [{
    key: 'toggleDialog',
    value: function toggleDialog() {
      this.setState({
        isRegistering: !this.state.isRegistering
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'auth-container', style: this.state.isRegistering ? { height: '350px' } : { height: '300px' } },
        this.state.isRegistering ? _react2.default.createElement(_register2.default, { switchToLogin: function switchToLogin() {
            return _this2.toggleDialog();
          } }) : _react2.default.createElement(_login2.default, { switchToRegister: function switchToRegister() {
            return _this2.toggleDialog();
          } })
      );
    }
  }]);

  return SigninController;
}(_react.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AJAX = require('../ajax');
var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');

module.exports = function (_React$Component) {
  _inherits(SongsController, _React$Component);

  function SongsController(props, context) {
    _classCallCheck(this, SongsController);

    var _this = _possibleConstructorReturn(this, (SongsController.__proto__ || Object.getPrototypeOf(SongsController)).call(this, props, context));

    var songData = [{ title: 'song1', dateCreated: 'Just Now' }, { title: 'song2', dateCreated: 'January 1st, 2016' }];
    _this.state = { songData: songData };
    return _this;
  }

  _createClass(SongsController, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      AJAX.Get('songs/user', function (response) {
        return _this2.loadSongs(JSON.parse(response));
      });
    }
  }, {
    key: 'loadSongs',
    value: function loadSongs(songJson) {
      var newSongData = songJson.map(function (song) {
        return { title: song.title, dateCreated: song.date };
      });
      this.setState({ songData: newSongData });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'button-container' },
          React.createElement(
            'form',
            { action: '/editor' },
            React.createElement('input', { className: 'create-song', type: 'submit', value: 'Create' })
          )
        ),
        React.createElement(
          'div',
          { className: 'song-list' },
          this.state.songData.map(function (song) {
            return React.createElement(
              'div',
              { className: 'song-list-item' },
              React.createElement(
                'div',
                { className: 'song-list-item-title' },
                song.title
              ),
              React.createElement(
                'div',
                { className: 'song-list-item-date' },
                song.dateCreated
              )
            );
          })
        )
      );
    }
  }]);

  return SongsController;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require("react");

module.exports = function (_React$Component) {
  _inherits(SuccessDisplayController, _React$Component);

  function SuccessDisplayController() {
    _classCallCheck(this, SuccessDisplayController);

    return _possibleConstructorReturn(this, (SuccessDisplayController.__proto__ || Object.getPrototypeOf(SuccessDisplayController)).apply(this, arguments));
  }

  _createClass(SuccessDisplayController, [{
    key: "checkLoginState",
    value: function checkLoginState() {
      FB.getLoginStatus(function (response) {
        if (response.status === "not_authorized") {
          alert("Login failed, please try again.");
        } else {
          window.location.href = "/success";
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "success-container", style: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, margin: "auto" } },
        React.createElement(
          "div",
          null,
          "SUCCESS"
        )
      );
    }
  }]);

  return SuccessDisplayController;
}(React.Component);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var currentUser = exports.currentUser = function currentUser() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  var type = action.type;

  switch (type) {
    default:
      return state;
  }
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editor = undefined;

var _actionTypes = require('../actions/action-types');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var addChordType = _actionTypes.editorActionTypes.addChordType;
var addLineType = _actionTypes.editorActionTypes.addLineType;
var addSectionType = _actionTypes.editorActionTypes.addSectionType;
var defaultEditorType = _actionTypes.editorActionTypes.defaultEditorType;
var deleteLineType = _actionTypes.editorActionTypes.deleteLineType;
var updateLinesType = _actionTypes.editorActionTypes.updateLinesType;
var updateSelectedType = _actionTypes.editorActionTypes.updateSelectedType;
var updateTextType = _actionTypes.editorActionTypes.updateTextType;


var editorLine = function editorLine() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case updateTextType:
      /*eslint-disable*/
      if (state.lineId != action.lineId) return state;

      return Object.assign({}, state, {
        text: action.text,
        updateTextFunction: action.updateTextFunction
      });
    case addLineType:
      return Object.assign({}, state, {
        lineId: action.lineId,
        text: action.text,
        type: action.lineType
      });
    case addChordType:
      if (state.lineId != action.lineId) return state;else {
        var chords = state.chords || [];
        chords.push({ index: action.index, text: action.text, updateSelectedFunction: action.updateSelectedFunction });
        return Object.assign({}, state, {
          chords: chords
        });
      }
    default:
      return state;
  }
};

var editorSection = function editorSection() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case addSectionType:
      return {
        lineData: [],
        selectedIndex: 0
      };
    case updateLinesType:
      if (state.sectionId != action.sectionId) return state;else {
        var lineData = state.lineData;
        for (var lineAction in action.lineActions) {
          lineData = editorSection(state, action.lineActions[lineAction]).lineData;
        }

        return Object.assign({}, state, {
          lineData: lineData,
          selectedLine: lineData[action.selectedIndex],
          selectedIndex: action.selectedIndex,
          offset: action.offset
        });
      }
    case updateSelectedType:
      if (state.sectionId != action.sectionId) return state;else {
        return Object.assign({}, state, {
          selectedIndex: action.index,
          selectedLine: state.lineData[action.index],
          offset: action.offset
        });
      }
    /* Line Reducer */
    case updateTextType:
      if (state.sectionId != action.sectionId) return state;
      /*eslint-disable*/
      return Object.assign({}, state, {
        lineData: state.lineData.map(function (line) {
          return editorLine(line, action);
        }),
        offset: action.offset
      });
    case addChordType:
      if (state.sectionId != action.sectionId) return state;
      /*eslint-disable*/
      return Object.assign({}, state, {
        lineData: state.lineData.map(function (line) {
          return editorLine(line, action);
        })
      });
    case addLineType:
      if (state.sectionId != action.sectionId) return state;else {
        var _lineData = state.lineData;
        _lineData.splice(action.index, 0, editorLine(undefined, action));
        if (action.shouldUpdateIndex) {
          return Object.assign({}, state, {
            lineData: _lineData,
            selectedIndex: action.index,
            selectedLine: _lineData[action.index]
          });
        } else {
          return Object.assign({}, state, {
            lineData: _lineData
          });
        }
      }
    case deleteLineType:
      if (state.sectionId != action.sectionId) return state;else {
        var _lineData2 = state.lineData;
        _lineData2.splice(action.index, 1);
        return Object.assign({}, state, {
          lineData: _lineData2,
          selectedIndex: action.index - 1,
          selectedLine: _lineData2[action.index - 1]
        });
      }
    default:
      return state;
  }
};

var editor = exports.editor = function editor() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { sectionData: [] };
  var action = arguments[1];

  switch (action.type) {
    case defaultEditorType:
      return {
        sectionData: action.sectionData
      };
    /* Section Reducer */
    case updateLinesType:
      return Object.assign({}, state, {
        sectionData: state.sectionData.map(function (section) {
          return editorSection(section, action);
        })
      });
    /*eslint-disable*/
    case addSectionType:
      return Object.assign({}, state, {
        sectionData: [].concat(_toConsumableArray(state.sectionData), [editorSection(undefined, action)])
      });
    /* Line Reducer */
    case updateTextType:
    case addLineType:
    case deleteLineType:
    case updateSelectedType:
    case addChordType:
      return Object.assign({}, state, {
        sectionData: state.sectionData.map(function (section) {
          return editorSection(section, action);
        })
      });
    default:
      return state;
  }
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appReducer = exports.editorReducer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _redux = require('redux');

var _currentUserReducer = require('./current-user-reducer.js');

var currentUserReducers = _interopRequireWildcard(_currentUserReducer);

var _editorReducer = require('./editor-reducer.js');

var editorReducers = _interopRequireWildcard(_editorReducer);

var _profileReducer = require('./profile-reducer.js');

var profileReducers = _interopRequireWildcard(_profileReducer);

var _messageReducer = require('./message-reducer.js');

var messageReducers = _interopRequireWildcard(_messageReducer);

var _validatorReducer = require('./validator-reducer.js');

var validatorReducers = _interopRequireWildcard(_validatorReducer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var editorReducer = exports.editorReducer = (0, _redux.combineReducers)(_extends({}, editorReducers));

var appReducer = exports.appReducer = (0, _redux.combineReducers)(_extends({}, profileReducers, editorReducers, messageReducers, currentUserReducers, validatorReducers));
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var messages = function messages() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  var _ret = function () {
    switch (action.type) {
      case 'RECEIVE_MESSAGE':
        var allMessages = state.messages.filter(function (message) {
          return message.id === action.id;
        });
        var messageExists = state.messages ? allMessages : [];

        if (action.content && messageExists.length === 0) {
          return {
            v: [].concat(_toConsumableArray(state), [{
              content: action.content,
              userId: action.userId,
              documentId: action.documentId,
              destinationId: action.destinationId,
              id: action.id
            }])
          };
        }
      case 'ADD_MESSAGE':
        if (action.content) {
          return {
            v: [].concat(_toConsumableArray(state), [{
              content: action.content,
              userId: action.userId,
              documentId: action.documentId ? action.documentId : null,
              destinationId: action.destinationid ? action.destinationId : null,
              id: action.id
            }])
          };
        }

        return {
          v: state
        };
      case 'PAGE_MESSAGES':
        var myState = state;
        if (action.response) {
          action.response.map(function (message) {
            myState = messages(myState, { type: 'ADD_MESSAGE', content: message.content, userId: message.user_id, documentId: message.document_id, id: message.id });
          });
          return {
            v: myState
          };
        };
      default:
        return {
          v: []
        };
    }
  }();

  if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
};

var messageApp = exports.messageApp = function messageApp() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case 'ADD_MESSAGE':
      return Object.assign({}, state, {
        messages: messages(state.messages, action)
      });
    case 'RECEIVE_MESSAGE':
      return Object.assign({}, state, {
        messages: messages(state.messages, action)
      });
    case 'PAGE_MESSAGES':
      return Object.assign({}, state, {
        messages: messages(state.messages, action)
      });
    case 'INITIAL_STATE':
      return Object.assign({}, state, {
        userId: action.userId,
        documentId: action.documentId
      });
    default:
      return {
        userId: -1,
        documentId: -1,
        messages: []
      };
  }
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.profile = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _actionTypes = require('../actions/action-types');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var loadUserTypes = _actionTypes.profileActionTypes.loadUserTypes;
var saveProfileTypes = _actionTypes.profileActionTypes.saveProfileTypes;
var updateBioType = _actionTypes.profileActionTypes.updateBioType;
var updateInstrumentsType = _actionTypes.profileActionTypes.updateInstrumentsType;
var profile = exports.profile = function profile() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  var type = action.type;

  switch (type) {
    case loadUserTypes.success:
      return _extends({}, state, action.result);

    case updateBioType:
      return _extends({}, state, {
        bio: action.bio
      });

    case updateInstrumentsType:
      return _extends({}, state, {
        preferences: _extends({}, state.preferences, {
          instruments: state.preferences.instruments.indexOf(action.instrument) === -1 ? [].concat(_toConsumableArray(state.preferences.instruments), [action.instrument]) : state.preferences.instruments.filter(function (instrument) {
            return instrument !== action.instrument;
          })
        })
      });

    case saveProfileTypes.success:
      return _extends({}, state, action.profile);

    default:
      return state;
  }
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validation = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _actionTypes = require('../actions/action-types');

var saveBioTypes = _actionTypes.profileActionTypes.saveBioTypes;
var validation = exports.validation = function validation() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    isValidBio: true
  };
  var action = arguments[1];

  var type = action.type;

  switch (type) {
    case saveBioTypes.error:
      return _extends({}, state, {
        isValidBio: false
      });

    case saveBioTypes.success:
      return _extends({}, state, {
        isValidBio: true
      });

    default:
      return state;
  }
};
// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var gcloud = require('google-cloud');
var path = require('path');

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

module.exports = function (gcloudConfig, cloudStorageBucket) {

  var storage = gcloud.storage(gcloudConfig);
  var bucket = storage.bucket(cloudStorageBucket);

  function sendUploadToGCS(filename, buffer, next) {
    var gcsname = '' + Date.now() + guid() + filename;

    if (gcsname.length >= 101) {
      gcsname = gcsname.substring(gcsname.length - 100);
    }

    var file = bucket.file(gcsname);
    var stream = file.createWriteStream();

    stream.on('error', function (err) {
      console.log('EERORRROROR ' + err);
      next({ error: err });
    });

    stream.on('finish', function () {
      next({ cloudStorageObject: gcsname, cloudStoragePublicUrl: getPublicUrl(gcsname) });
    });

    stream.end(buffer);
  }

  function getPublicUrl(filename) {
    return 'https://storage.googleapis.com/' + cloudStorageBucket + '/' + filename;
  }

  return {
    getPublicUrl: getPublicUrl,
    sendUploadToGCS: sendUploadToGCS
  };
};
