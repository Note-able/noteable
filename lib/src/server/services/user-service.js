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