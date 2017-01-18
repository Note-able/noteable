'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _userDto = require('./model/userDto.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        connection.client.query('\n        SELECT p.id, p.email, p.location, p.cover_url, p.name, p.avatar_url, p.bio FROM public.profile p\n        WHERE p.id = ' + userId + ';\n        \n        SELECT * FROM public.instruments i\n        WHERE i.user_id = ' + userId + ';').on('row', function (row) {
          user.push(row);
        }).on('error', function (error) {
          console.log('error encountered ' + error);
          callback({ id: -1 });
        }).on('end', function () {
          if (user.length === 0) {
            callback({ id: -1 });
            return;
          }
          user[0].instruments = user[1] != null ? user[1].instruments : '';
          // user[0].profileImage = image.getPublicUrl(user[0].filename);
          connection.fin();
          callback((0, _userDto.userMapper)(user[0]));
        });
      });
    }
  }, {
    key: 'getUsers',
    value: function getUsers(userIds, callback) {
      if (userIds == null || userIds.length === 0) {
        callback({ id: -1 });
        return;
      }

      this.options.connect(this.options.database, function (connection) {
        if (connection.client == null) {
          return callback({ id: -1 });
        }

        var users = {};
        connection.client.query('\n        SELECT p.id, p.email, p.location, p.cover_url, p.name, p.avatar_url, p.bio FROM public.profile p\n        WHERE p.id IN (' + userIds.join(', ') + ');\n        \n        SELECT * FROM public.instruments i\n        WHERE i.user_id IN (' + userIds.join(', ') + ');').on('row', function (row) {
          if (row.name) users[row.id] = _extends({}, row, { instruments: '' });else users[row.user_id].instruments = row.instruments;
        }).on('error', function (error) {
          console.log('error encountered ' + error);
          callback({ id: -1 });
        }).on('end', function () {
          if (users.length === 0) {
            callback({ id: -1 });
            return;
          }

          // user[0].profileImage = image.getPublicUrl(user[0].filename);
          connection.fin();
          callback(Object.keys(users).map(function (id) {
            return (0, _userDto.userMapper)(users[id]);
          }));
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