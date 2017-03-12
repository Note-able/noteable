'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _notificationDto = require('./model/notificationDto.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Notifications = (0, _notificationDto.DbNotificationHelper)();

/**
 * constructor(options) {
    this.options = options;
  }

  createNotification({ createdDate, kind, isDeleted, recipientId, sourceId, status  })
  updateNotification({ createdDate, kind, isDeleted, recipientId, sourceId })
  getNotification(id)
  getNotifications(ids, limit, notificationId)
  getNotificationsByUser(userId, limit, notificationId)
  deleteNotification(id)
 */

var NotificationService = function () {
  function NotificationService(options) {
    _classCallCheck(this, NotificationService);

    this.options = options;
  }

  _createClass(NotificationService, [{
    key: 'createNotification',
    value: function createNotification(notificationDto) {
      var _this = this;

      if (notificationDto.createdDate == null) {
        notificationDto.createdDate = Date.now();
      }

      if (notificationDto.status == null) {
        Notifications.Status[notificationDto.status.toLower()] = Notifications.Status.unread;
      }

      return new Promise(function (resolve, reject) {
        var id = void 0;
        _this.options.connect(_this.options.database, function (connection) {
          connection.client.query('INSERT INTO ' + Notifications.columns('', 'INSERT') + ' VALUES ' + Notifications.values('', notificationDto, 'INSERT') + ' RETURNING id;').on('row', function (row) {
            return id = row;
          }).on('error', function (error) {
            return reject(error);
          }).on('end', function () {
            return resolve(id);
          });
        });
      });
    }
  }, {
    key: 'updateNotification',
    value: function updateNotification(notificationDto) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.options.connect(_this2.options.database, function (connection) {
          connection.client.query(Notifications.updateQuery('', notificationDto)).on('error', function (error) {
            return reject(error);
          }).on('end', function () {
            return resolve();
          });
        });
      });
    }
  }, {
    key: 'markNotificationsAsRead',
    value: function markNotificationsAsRead(userId) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.options.connect(_this3.options.database, function (connection) {
          connection.client.query(Notifications.markRead('') + ' WHERE recipient_id = ' + userId + ';');
        });
      });
    }
  }, {
    key: 'getNotification',
    value: function getNotification(id) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4.options.connect(_this4.options.database, function (connection) {
          var notification = null;
          connection.client.query('SELECT ' + Notifications.columns('', 'SELECT') + ' WHERE id = ' + id + ';').on('row', function (row) {
            return notification = dbNotificationMapper(row);
          }).on('error', function (error) {
            return reject(error);
          }).on('end', function () {
            return resolve(notification);
          });
        });
      });
    }
  }, {
    key: 'getNotifications',
    value: function getNotifications(ids, limit, status) {
      var _this5 = this;

      if (typeof status == 'undefined') {
        status = Notifications.Status.any;
      }

      status = Notifications.Status[status.toLower()];

      return new Promise(function (resolve, reject) {
        _this5.options.connect(_this5.options.database, function (connection) {
          var notifications = [];
          connection.client.query('SELECT ' + Notifications.columns('', 'SELECT') + '\n            WHERE id in (' + ids.toString() + ')\n            ' + (status === Notifications.Status.any ? '' : 'AND status = ' + status) + '\n            LIMIT ' + limit + ';').on('row', function (row) {
            return notifications.push(Notifications.dbNotificationMapper(row));
          }).on('error', function (error) {
            return reject(error);
          }).on('end', function () {
            return resolve(notifications);
          });
        });
      });
    }
  }, {
    key: 'getNotificationsByUser',
    value: function getNotificationsByUser(userId, limit, offsetId, status) {
      var _this6 = this;

      var offset = 0;
      if (offsetId !== 0) {
        offset = offsetId;
      }

      status = Notifications.Status[status.toLower()];

      return new Promise(function (resolve, reject) {
        _this6.options.connect(_this6.options.database, function (connection) {
          var notifications = [];
          connection.client.query('SELECT ' + Notifications.columns('', 'SELECT') + ' \n            WHERE recipient_id = ' + userId + ' \n            AND id > ' + offset + '\n            ' + (status === Notifications.Status.any ? '' : 'AND status = ' + status) + '\n            LIMIT ' + limit + ';').on('row', function (row) {
            return notifications.push(Notifications.dbNotificationMapper(row));
          }).on('error', function (error) {
            return reject(error);
          }).on('end', function () {
            return resolve(notifications);
          });
        });
      });
    }
  }, {
    key: 'deleteNotification',
    value: function deleteNotification(id) {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        _this7.options.connect(_this7.options.database, function (connection) {
          connection.client.query('DELETE FROM public.notifications WHERE id = ' + id + ';').on('error', function (error) {
            return reject(error);
          }).on('end', function () {
            return resolve();
          });
        });
      });
    }
  }]);

  return NotificationService;
}();

exports.default = NotificationService;