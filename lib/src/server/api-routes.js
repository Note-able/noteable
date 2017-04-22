'use strict';

var _userApi = require('./apis/user-api.js');

var _userApi2 = _interopRequireDefault(_userApi);

var _eventsApi = require('./apis/events-api.js');

var _eventsApi2 = _interopRequireDefault(_eventsApi);

var _documentsApi = require('./apis/documents-api.js');

var _documentsApi2 = _interopRequireDefault(_documentsApi);

var _messagesApi = require('./apis/messages-api.js');

var _messagesApi2 = _interopRequireDefault(_messagesApi);

var _musicApi = require('./apis/music-api.js');

var _musicApi2 = _interopRequireDefault(_musicApi);

var _newsfeedApi = require('./apis/newsfeed-api.js');

var _newsfeedApi2 = _interopRequireDefault(_newsfeedApi);

var _notificationsApi = require('./apis/notifications-api.js');

var _notificationsApi2 = _interopRequireDefault(_notificationsApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (app, options) {
  app.get('/database', function (req, res) {
    options.connect(options.database, function (connection) {
      if (connection.status === 'SUCCESS') {
        res.status(200).send();
      } else {
        res.status(500).send();
      }
    });
  });

  (0, _userApi2.default)(app, options);
  (0, _eventsApi2.default)(app, options);
  (0, _documentsApi2.default)(app, options);
  (0, _messagesApi2.default)(app, options);
  (0, _musicApi2.default)(app, options);
  (0, _newsfeedApi2.default)(app, options);
  (0, _notificationsApi2.default)(app, options);
};