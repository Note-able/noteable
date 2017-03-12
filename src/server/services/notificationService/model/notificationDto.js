const notificationKindMap = {
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
  'messageReceived': 7,
};

export const DbNotificationHelper = () => ({
  map: (dbNotification) => (dbNotification == null ? null : {
    createdDate: dbNotification.created_date,
    kind: notificationKindMap[dbNotification.kind],
    id: dbNotification.id,
    isDeleted: dbNotification.is_deleted,
    recipientId: dbNotification.recipient_id,
    sourceId: dbNotification.source_id,
    status: dbNotification.status,
  }),

  mapToDB: (notification) => (notification == null ? null : {
    ...notification,
    kind: notificationKindMap[notification.kind],
  }),

  updateQuery: (t, { createdDate, kind, isDeleted, recipientId, sourceId, id, status }) => {
    const pre = t == null || t === '' ? '' : `${t}.`;
    return `UPDATE public.notifications SET created_date = ${createdDate}, kind = '${kind}', is_deleted = ${isDeleted}, recipient_id = ${recipientId}, source_Id = ${sourceId}, status = ${status} WHERE id = ${id};`
  },

  markRead: (t) => {
    const pre = t == null || t === '' ? '' : `${t}.`;
    return `UPDATE public.notifications SET ${pre + 'status'} = 1`;
  },

  columns: (t, kind) => {
    const pre = t == null || t === '' ? '' : `${t}.`;
    switch(kind) {
      case 'INSERT':
        return `public.notifications ${pre === '' ? t : 'AS ' + t} (${pre + 'kind'}, ${pre + 'recipient_id'}, ${pre + 'created_date'}, ${pre + 'source_id'}, ${pre + 'is_deleted'}, ${pre + 'status'})`;
      case 'SELECT':
        return `created_date, kind, id, recipient_id, source_id, is_deleted, status FROM public.notifications ${t === '' ? '' : ' AS ' + t}`;
      default:
        return '*';
    }
  },

  values: (t, { createdDate, kind, isDeleted, recipientId, sourceId, status }, query) => {
    const pre = t == null || t === '' ? '' : `${t}.`;
    switch(query) {
      case 'INSERT':
        return `(${createdDate || ''}, ${kind || ''}, ${recipientId || ''}, ${sourceId || ''}, ${isDeleted}, ${status})`;
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
});
