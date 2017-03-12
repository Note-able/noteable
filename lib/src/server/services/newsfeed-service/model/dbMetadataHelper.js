'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DbMetadataHelper = exports.DbMetadataHelper = function DbMetadataHelper() {
  return {
    map: function map(dbMetadata) {
      return dbMetadata == null ? null : {
        createdDate: dbMetadata.created_date,
        url: dbMetadata.url,
        musicId: dbMetadata.music_id,
        eventId: dbMetadata.event_id,
        id: dbMetadata.id
      };
    },

    mapToDB: function mapToDB(metadata) {
      return metadata == null ? null : {
        created_date: metadata.createdDate,
        url: metadata.url,
        music_id: metadata.musicId,
        event_id: metadata.eventId,
        id: metadata.id
      };
    },

    validateMetadata: function validateMetadata(metadata) {
      return true;
    },

    updateQuery: function updateQuery(t, _ref) {
      var createdDate = _ref.createdDate,
          url = _ref.url,
          musicId = _ref.musicId,
          eventId = _ref.eventId,
          id = _ref.id;

      var pre = t == null || t === '' ? '' : t + '.';
      return 'UPDATE public.content_metadata SET\n      created_date = ' + createdDate + ',\n      url = ' + url + ',\n      music_id = ' + musicId + ',\n      event_id = ' + eventId + ',\n      WHERE id = ' + id + ';';
    },

    columns: function columns(t, kind) {
      var pre = t == null || t === '' ? '' : t + '.';
      switch (kind) {
        case 'INSERT':
          return 'public.content_metadata ' + (pre === '' ? t : 'AS ' + t) + '(\n          ' + pre + 'created_date,\n          ' + pre + 'url,\n          ' + pre + 'music_id,\n          ' + pre + 'event_id);\n        ';
        case 'SELECT':
          return 'created_date, url, music_id, event_id, id FROM public.content_metadata ' + (t === '' ? '' : ' AS ' + t);
        default:
          return '*';
      }
    },

    values: function values(t, _ref2, query) {
      var createdDate = _ref2.createdDate,
          url = _ref2.url,
          musicId = _ref2.musicId,
          eventId = _ref2.eventId,
          id = _ref2.id;

      var pre = t == null || t === '' ? '' : t + '.';
      switch (query) {
        case 'INSERT':
          return '(\n          ' + createdDate + ',\n          ' + url + ',\n          ' + musicId + ',\n          ' + eventId + ',\n          ' + id + '\n        )';
        default:
          return '';
      }
    }
  };
};