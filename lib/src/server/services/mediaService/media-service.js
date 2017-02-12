'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _musicDto = require('./model/musicDto.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MusicService = function () {
  function MusicService(options) {
    _classCallCheck(this, MusicService);

    this.options = options;
  }

  _createClass(MusicService, [{
    key: 'getMusic',
    value: function getMusic(id) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.options.connect(_this.options.database, function (connection) {
          var music = void 0;
          connection.client.query('SELECT ' + (0, _musicDto.columns)('m', 'SELECT') + ' WHERE m.id = ' + id + ';').on('row', function (row) {
            music = row;
          }).on('error', function (error) {
            return reject(error);
          }).on('end', function () {
            return resolve((0, _musicDto.musicMapper)(music));
          });
        });
      });
    }
  }, {
    key: 'createMusic',
    value: function createMusic(musicDto) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.options.connect(_this2.options.database, function (connection) {
          var id = void 0;
          console.log('INSERT INTO ' + (0, _musicDto.columns)('', 'INSERT') + ' VALUES ' + (0, _musicDto.values)('', musicDto, 'INSERT') + ' RETURNING ID;');
          connection.client.query('INSERT INTO ' + (0, _musicDto.columns)('', 'INSERT') + ' VALUES ' + (0, _musicDto.values)('', musicDto, 'INSERT') + ' RETURNING ID;').on('row', function (row) {
            id = row;
          }).on('error', function (error) {
            return reject(error);
          }).on('end', function () {
            return resolve(id);
          });
        });
      });
    }
  }]);

  return MusicService;
}();

exports.default = MusicService;