'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DbNewsfeedHelper = undefined;

var _ = require('../');

var DbMetadataHelper = (0, _.dbMetadataHelper)();

var DbNewsfeedHelper = exports.DbNewsfeedHelper = function DbNewsfeedHelper() {
  return {
    map: function map(dbNewsfeed, contentMetadata) {
      return dbNewsfeed == null ? null : {
        createdDate: dbNewsfeed.created_date,
        kind: NewsItemKind[dbNewsfeed.kind],
        id: dbNewsfeed.id,
        isDeleted: dbNewsfeed.is_deleted,
        recipientId: dbNewsfeed.recipient_id,
        status: dbNewsfeed.status,
        contentMetadata: DbMetadataHelper.map(contentMetadata),
        text: dbNewsfeed.text
      };
    },

    mapToDB: function mapToDB(newsfeed) {
      return newsfeed == null ? null : {
        id: newsfeed.id,
        created_date: newsfeed.createdDate,
        is_deleted: newsfeed.isDeleted,
        kind: NewsItemKind[newsfeed.kind],
        recipient_id: newsfeed.recipientId,
        status: newsfeed.status,
        content_metadata: newsfeed.contentMetadata.id,
        text: newsfeed.text
      };
    },

    validateNewsItem: function validateNewsItem(newsfeed) {
      return true;
    },

    updateQuery: function updateQuery(t, _ref) {
      var createdDate = _ref.createdDate,
          kind = _ref.kind,
          isDeleted = _ref.isDeleted,
          authorId = _ref.authorId,
          contentMetadataId = _ref.contentMetadataId,
          text = _ref.text,
          modifiedDate = _ref.modifiedDate,
          id = _ref.id;

      var pre = t == null || t === '' ? '' : t + '.';
      return 'UPDATE public.newsfeed SET\n      created_date = ' + createdDate + ',\n      kind = \'' + kind + ',\n      is_deleted = ' + isDeleted + ',\n      recipient_id = ' + recipientId + ',\n      author_id = ' + authorId + ',\n      content_metadata = ' + contentMetadataId + ',\n      text = ' + text + ',\n      modified_date = ' + modifiedDate + '\n      WHERE id = ' + id + ';';
    },

    columns: function columns(t, kind) {
      var pre = t == null || t === '' ? '' : t + '.';
      switch (kind) {
        case 'INSERT':
          return 'public.ewsfeed ' + (pre === '' ? t : 'AS ' + t) + '(\n          ' + pre + 'kind,\n          ' + pre + 'created_date,\n          ' + pre + 'is_deleted,\n          ' + pre + 'recipient_id,\n          ' + pre + 'author_id,\n          ' + pre + 'content_metadata,\n          ' + pre + 'text,\n          ' + pre + 'modified_date);\n        ';
        case 'SELECT':
          return 'kind, created_date, is_deleted, recipient_id, author_id, content_metadata, text, modified_date FROM public.newsfeed ' + (t === '' ? '' : ' AS ' + t);
        default:
          return '*';
      }
    },

    values: function values(t, _ref2, query) {
      var createdDate = _ref2.createdDate,
          kind = _ref2.kind,
          isDeleted = _ref2.isDeleted,
          authorId = _ref2.authorId,
          recipientId = _ref2.recipientId,
          contentMetadataId = _ref2.contentMetadataId,
          text = _ref2.text,
          modifiedDate = _ref2.modifiedDate,
          id = _ref2.id;

      var pre = t == null || t === '' ? '' : t + '.';
      switch (query) {
        case 'INSERT':
          return '(\n          ' + createdDate + ',\n          ' + kind + ',\n          ' + isDeleted + ',\n          ' + authorId + ',\n          ' + contentMetadataId + ',\n          \'' + text + ',\n          ' + modifiedDate + ',\n          ' + recipientId + '\n        )';
        default:
          return '';
      }
    },

    NewsItemKind: {
      0: 'music',
      music: 0,
      1: 'event',
      event: 1,
      2: 'engagement',
      engagement: 2
    }
  };
};