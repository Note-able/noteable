'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DbNewsfeedHelper = undefined;

var _dbMetadataHelper = require('./dbMetadataHelper.js');

var MetadataHelper = (0, _dbMetadataHelper.DbMetadataHelper)();

var DbNewsfeedHelper = exports.DbNewsfeedHelper = function DbNewsfeedHelper() {
  return {
    map: function map(dbNewsfeed, contentMetadata) {
      return dbNewsfeed == null ? null : {
        createdDate: dbNewsfeed.created_date,
        kind: NewsItemKind[dbNewsfeed.kind],
        id: dbNewsfeed.id,
        isDeleted: dbNewsfeed.is_deleted,
        destinationId: dbNewsfeed.destination_id,
        status: dbNewsfeed.status,
        contentMetadata: MetadataHelper.map(contentMetadata),
        text: dbNewsfeed.text
      };
    },

    mapToDB: function mapToDB(newsfeed) {
      return newsfeed == null ? null : {
        id: newsfeed.id,
        created_date: newsfeed.createdDate,
        is_deleted: newsfeed.isDeleted,
        kind: NewsItemKind[newsfeed.kind],
        destination_id: newsfeed.destinationId,
        status: newsfeed.status,
        content_metadata: newsfeed.contentMetadata.id,
        text: newsfeed.text
      };
    },

    validateNewsItem: function validateNewsItem(newsfeed) {
      return true;
    },

    updateQuery: function updateQuery(_ref) {
      var createdDate = _ref.createdDate,
          kind = _ref.kind,
          isDeleted = _ref.isDeleted,
          authorId = _ref.authorId,
          contentMetadataId = _ref.contentMetadataId,
          text = _ref.text,
          modifiedDate = _ref.modifiedDate,
          id = _ref.id,
          destinationId = _ref.destinationId;

      return 'UPDATE public.newsfeed SET\n      created_date = ' + createdDate + ',\n      kind = \'' + kind + ',\n      is_deleted = ' + isDeleted + ',\n      destination_id = ' + destinationId + ',\n      author_id = ' + authorId + ',\n      content_metadata = ' + contentMetadataId + ',\n      text = ' + text + ',\n      modified_date = ' + modifiedDate + '\n      WHERE id = ' + id + ';';
    },

    columns: function columns(kind, id) {
      switch (kind) {
        case 'INSERT':
          return 'public.newsfeed (\n          kind,\n          created_date,\n          is_deleted,\n          destination_id,\n          author_id,\n          content_metadata,\n          text,\n          modified_date);\n        ';
        case 'SELECT':
          return 'n.kind, n.created_date, n.is_deleted, n.destination_id, n.author, n.content_metadata, n.text, n.modified_date, m.event_id, m.music_id, m.url, m.id as metadata_id, n.id\n        FROM public.newsfeed n \n        INNER JOIN public.content_metadata m \n        ON m.id = n.content_metadata';
        default:
          return '*';
      }
    },

    values: function values(_ref2, query) {
      var createdDate = _ref2.createdDate,
          kind = _ref2.kind,
          isDeleted = _ref2.isDeleted,
          authorId = _ref2.authorId,
          destinationId = _ref2.destinationId,
          contentMetadataId = _ref2.contentMetadataId,
          text = _ref2.text,
          modifiedDate = _ref2.modifiedDate,
          id = _ref2.id;

      switch (query) {
        case 'INSERT':
          return '(\n          ' + createdDate + ',\n          ' + kind + ',\n          ' + (isDeleted || '0') + ',\n          ' + authorId + ',\n          ' + contentMetadataId + ',\n          \'' + text + ',\n          ' + modifiedDate + ',\n          ' + destinationId + '\n        )';
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