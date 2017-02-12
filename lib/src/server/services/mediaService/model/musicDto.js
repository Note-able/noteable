'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var musicMapper = exports.musicMapper = function musicMapper(dbMusic) {
  return dbMusic == null ? null : {
    audioUrl: dbMusic.audio_url,
    author: dbMusic.author,
    coverUrl: dbMusic.cover_url,
    createdDate: dbMusic.created_date,
    description: dbMusic.description,
    duration: dbMusic.duration,
    id: dbMusic.id,
    name: dbMusic.name,
    size: dbMusic.size
  };
};

var columns = exports.columns = function columns(t, kind) {
  var pre = t == null || t === '' ? '' : t + '.';
  switch (kind) {
    case 'INSERT':
    case 'UPDATE':
      return 'public.music' + (pre === '' ? t : '') + ' (' + (pre + 'audio_url') + ', ' + (pre + 'author') + ', ' + (pre + 'cover_url') + ', ' + (pre + 'created_date') + ', ' + (pre + 'description') + ', ' + (pre + 'duration') + ', ' + (pre + 'name') + ', ' + (pre + 'size') + ')';
    case 'SELECT':
      return 'public.music' + (pre === '' ? t : '') + ' (' + (pre + 'audio_url') + ', ' + (pre + 'author') + ', ' + (pre + 'cover_url') + ', ' + (pre + 'created_date') + ', ' + (pre + 'description') + ', ' + (pre + 'duration') + ', ' + (pre + 'name') + ', ' + (pre + 'size') + ', ' + (pre + 'id') + ')';
    default:
      return '*';
  }
};

var values = exports.values = function values(t, _ref, kind) {
  var audioUrl = _ref.audioUrl,
      author = _ref.author,
      coverUrl = _ref.coverUrl,
      createdDate = _ref.createdDate,
      description = _ref.description,
      duration = _ref.duration,
      id = _ref.id,
      name = _ref.name,
      size = _ref.size;

  var pre = t == null || t === '' ? '' : t + '.';
  switch (kind) {
    case 'INSERT':
      return '(\'' + (pre + audioUrl || '') + '\', ' + (pre + author) + ', \'' + (pre + (coverUrl || '')) + '\', \'' + (pre + createdDate) + '\', \'' + (pre + (description || '')) + '\', \'' + (pre + (duration || '')) + '\', \'' + (pre + name || '') + '\', \'' + (pre + size || '') + '\')';
    default:
      return '';
  }
};