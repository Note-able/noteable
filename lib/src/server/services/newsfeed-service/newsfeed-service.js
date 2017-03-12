'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _newsfeedDto = require('./model/newsfeedDto.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Newsfeed = (0, _newsfeedDto.DbNewsfeedHelper)();
var Metadata = (0, _newsfeedDto.DbMetadataHelper)();

/*
    newsfeedDto {
      createdDate,
      modifiedDate,
      isDeleted,
      kind,
      id,
      text,
      authorId,
      recipientId,
      contentMetadata {
        id,
        url,
        musicId,
        eventId,
        createdDate
      }
    }
  */

/**
 * constructor(options) {
    this.options = options;
  }

  createNewsfeedItem({ createdDate, kind, isDeleted, authorId, sourceId, contentMetadata, text, modifiedDate })
  updateNotification({ createdDate, kind, isDeleted, recipientId, sourceId })
  getNotification(id)
  getNotifications(ids, limit, notificationId)
  getNotificationsByUser(userId, limit, notificationId)
  deleteNotification(id)
 */

var NewsfeedService = function () {
  function NewsfeedService(options) {
    _classCallCheck(this, NewsfeedService);

    this.options = options;
  }

  _createClass(NewsfeedService, [{
    key: 'createMetadataItem',
    value: function createMetadataItem(metadataDto) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (!_newsfeedDto.DbMetadataHelper.validateMetadata(metadataDto)) {
          return reject('Invalid dto', metadataDto);
        }

        var id = void 0;
        _this.options.connect(_this.options.database, function (connection) {
          connection.client.query('INSERT INTO ' + Metadata.columns('', 'INSERT') + '\n            VALUES ' + Metadata.values('', metadataDto, 'INSERT') + ' RETURNING id;').on('row', function (row) {
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
    key: 'createNewsfeedItem',
    value: function createNewsfeedItem(newsfeedDto) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (!_newsfeedDto.DbNewsfeedHelper.validateNewsItem(newsfeedDto)) {
          return reject('Invalid dto', newsfeedDto);
        }

        if (newsfeedDto.createdDate == null) {
          newsfeedDto.createdDate = Date.now();
        }

        _this2.createMetadataItem(newsfeedDto.contentMetadata).then(function (metadataId) {
          var id = void 0;
          newsfeedDto.contentMetadataId = metadataId;
          _this2.options.connect(_this2.options.database, function (connection) {
            connection.client.query('INSERT INTO ' + Newsfeed.columns('', 'INSERT') + ' VALUES ' + values('', newsfeedDto, 'INSERT') + ' RETURNING id;').on('row', function (row) {
              return id = row;
            }).on('error', function (error) {
              return reject(error);
            }).on('end', function () {
              return resolve(id);
            });
          });
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }]);

  return NewsfeedService;
}();

exports.default = NewsfeedService;