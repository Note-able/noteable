'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var notificationKindMap = {
  1: 'userJoined',
  'userJoined': 1,
  2: 'songPublished',
  'songPublished': 2,
  3: 'eventCreated',
  'eventCreated': 3,
  4: 'bandSearch',
  'bandSearch': 4,
  5: 'replyCreated',
  'replyCreated': 5,
  6: 'accountMention',
  'accountMention': 6,
  7: 'messageReceived',
  'messageReceived': 7
};

var DbNotificationHelper = exports.DbNotificationHelper = function DbNotificationHelper() {
  return {
    map: function map(dbNotification) {
      return dbNotification == null ? null : {
        createdDate: dbNotification.created_date,
        kind: notificationKindMap[dbNotification.kind],
        id: dbNotification.id,
        isDeleted: dbNotification.is_deleted,
        recipientId: dbNotification.recipient_id,
        sourceId: dbNotification.source_id,
        status: dbNotification.status
      };
    },

    mapToDB: function mapToDB(notification) {
      return notification == null ? null : _extends({}, notification, {
        kind: notificationKindMap[notification.kind]
      });
    },

    updateQuery: function updateQuery(t, _ref) {
      var createdDate = _ref.createdDate,
          kind = _ref.kind,
          isDeleted = _ref.isDeleted,
          recipientId = _ref.recipientId,
          sourceId = _ref.sourceId,
          id = _ref.id,
          status = _ref.status;

      var pre = t == null || t === '' ? '' : t + '.';
      return 'UPDATE public.notifications SET created_date = ' + createdDate + ', kind = \'' + kind + '\', is_deleted = ' + isDeleted + ', recipient_id = ' + recipientId + ', source_Id = ' + sourceId + ', status = ' + status + ' WHERE id = ' + id + ';';
    },

    markRead: function markRead(t) {
      var pre = t == null || t === '' ? '' : t + '.';
      return 'UPDATE public.notifications SET ' + (pre + 'status') + ' = 1';
    },

    columns: function columns(t, kind) {
      var pre = t == null || t === '' ? '' : t + '.';
      switch (kind) {
        case 'INSERT':
          return 'public.notifications ' + (pre === '' ? t : 'AS ' + t) + ' (' + (pre + 'kind') + ', ' + (pre + 'recipient_id') + ', ' + (pre + 'created_date') + ', ' + (pre + 'source_id') + ', ' + (pre + 'is_deleted') + ', ' + (pre + 'status') + ')';
        case 'SELECT':
          return 'created_date, kind, id, recipient_id, source_id, is_deleted, status FROM public.notifications ' + (t === '' ? '' : ' AS ' + t);
        default:
          return '*';
      }
    },

    values: function values(t, _ref2, query) {
      var createdDate = _ref2.createdDate,
          kind = _ref2.kind,
          isDeleted = _ref2.isDeleted,
          recipientId = _ref2.recipientId,
          sourceId = _ref2.sourceId,
          status = _ref2.status;

      var pre = t == null || t === '' ? '' : t + '.';
      switch (query) {
        case 'INSERT':
          return '(' + (createdDate || '') + ', ' + (kind || '') + ', ' + (recipientId || '') + ', ' + (sourceId || '') + ', ' + isDeleted + ', ' + status + ')';
        default:
          return '';
      }
    },

    Status: {
      0: 'any',
      any: 0,
      1: 'read',
      read: 1,
      2: 'unread',
      unread: 2
    }
  };
};