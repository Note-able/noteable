const notificationKindToId = {
  1: 'userJoined',
  2: 'songPublished',
  3: 'eventCreated',
  4: 'bandSearch',
  5: 'replyCreated',
  6: 'accountMention',
  7: 'messageReceived',
};

const notificationIdToKind = {
  'userJoined': 1,
  'songPublished': 2,
  'eventCreated': 3,
  'bandSearch': 4,
  'replyCreated': 5,
  'accountMention': 6,
  'messageReceived': 7,
};

export const dbNotificationMapper = (dbNotification) => (dbNotification == null ? null : {
  createdDate: dbNotification.created_date,
  kind: notificationIdToKind[dbNotification.kind],
  id: dbNotification.id,
  isDeleted: dbNotification.is_deleted,
  recipientId: dbNotification.recipient_id,
  sourceId: dbNotification.source_id,
});

export const columns = (t, kind) => {
  const pre = t == null || t === '' ? '' : `${t}.`;
  switch(kind) {
    case 'INSERT':
    case 'UPDATE':
      return `public.notifications ${pre === '' ? t : ''} (${pre + 'kind'}, ${pre + 'recipient_id'}, ${pre + 'created_date'}, ${pre + 'source_id'}, ${pre + 'is_deleted'})`;
    case 'SELECT':
      return `created_date, kind, id, recipient_id, source_id, is_deleted FROM public.notifications ${t === '' ? '' : ' AS ' + t}`;
    default:
      return '*';
  }
};

export const values = (t, { createdDate, kind, id, recipientId, sourceId }, kind) => {
  const pre = t == null || t === '' ? '' : `${t}.`;
  switch(kind) {
    case 'INSERT':
      return `('${pre + (createdDate || '')}', '${pre + (kind || '')}', '${pre + recipientId || ''}', '${pre + sourceId || ''}', ${pre + is_deleted})`;
    default:
      return '';
  }
}
