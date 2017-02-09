'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventDto = require('./model/eventDto.js');

var _index = require('../index.js');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventService = function () {
  function EventService(options) {
    _classCallCheck(this, EventService);

    this.options = options;
    this.m_userService = new _index.UserService(options);
  }

  //TODO: Actually get them by location


  _createClass(EventService, [{
    key: 'getEventsByLocation',
    value: function getEventsByLocation() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.options.connect(_this.options.database, function (connection) {
          if (connection.client == null) {
            reject('Failed to connect to database.');
            return;
          }

          var events = [];
          connection.client.query('\n          SELECT * FROM events LIMIT 50;').on('row', function (row) {
            events.push(row);
          }).on('error', function (error) {
            reject(error);return;
          }).on('end', function () {
            connection.done();
            var userIds = events.map(function (event) {
              return event.user_id;
            });
            userIds = [].concat(_toConsumableArray(new Set(userIds)));
            _this.m_userService.getUsers(userIds, function (users) {
              var usersById = users.reduce(function (map, user) {
                map[user.id];return map;
              }, {});
              resolve(events.map(function (event) {
                return (0, _eventDto.eventMapper)(event, usersById[event.user_id]);
              }));
            });
          });
        });
      });
    }
  }]);

  return EventService;
}();

exports.default = EventService;