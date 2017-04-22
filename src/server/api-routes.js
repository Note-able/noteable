import userApi from './apis/user-api.js';
import eventsApi from './apis/events-api.js';
import documentsApi from './apis/documents-api.js';
import messagesApi from './apis/messages-api.js';
import musicApi from './apis/music-api.js';
import newsfeedApi from './apis/newsfeed-api.js';
import notificationsApi from './apis/notifications-api.js';

module.exports = function (app, options) {
  app.get('/database', (req, res) => {
    options.connect(options.database, (connection) => {
      if (connection.status === 'SUCCESS') {
        res.status(200).send();
      } else {
        res.status(500).send();
      }
    });
  });

  userApi(app, options);
  eventsApi(app, options);
  documentsApi(app, options);
  messagesApi(app, options);
  musicApi(app, options);
  newsfeedApi(app, options);
  notificationsApi(app, options);
};
