import { dbMetadataHelper } from '../';
const DbMetadataHelper = dbMetadataHelper();

export const DbNewsfeedHelper = () => ({
  map: (dbNewsfeed, contentMetadata) => (dbNewsfeed == null ? null : {
    createdDate: dbNewsfeed.created_date,
    kind: NewsItemKind[dbNewsfeed.kind],
    id: dbNewsfeed.id,
    isDeleted: dbNewsfeed.is_deleted,
    recipientId: dbNewsfeed.recipient_id,
    status: dbNewsfeed.status,
    contentMetadata: DbMetadataHelper.map(contentMetadata),
    text: dbNewsfeed.text
  }),

  mapToDB: (newsfeed) => (newsfeed == null ? null : {
    id: newsfeed.id,
    created_date: newsfeed.createdDate,
    is_deleted: newsfeed.isDeleted,
    kind: NewsItemKind[newsfeed.kind],
    recipient_id: newsfeed.recipientId,
    status: newsfeed.status,
    content_metadata: newsfeed.contentMetadata.id,
    text: newsfeed.text
  }),

  validateNewsItem: (newsfeed) => {
    return true;
  },

  updateQuery: (t, { createdDate, kind, isDeleted, authorId, contentMetadataId, text, modifiedDate, id }) => {
    const pre = t == null || t === '' ? '' : `${t}.`;
    return `UPDATE public.newsfeed SET
      created_date = ${createdDate},
      kind = '${kind},
      is_deleted = ${isDeleted},
      recipient_id = ${recipientId},
      author_id = ${authorId},
      content_metadata = ${contentMetadataId},
      text = ${text},
      modified_date = ${modifiedDate}
      WHERE id = ${id};`;
  },

  columns: (t, kind) => {
    const pre = t == null || t === '' ? '' : `${t}.`;
    switch(kind) {
      case 'INSERT':
        return `public.ewsfeed ${pre === '' ? t : 'AS ' + t}(
          ${pre}kind,
          ${pre}created_date,
          ${pre}is_deleted,
          ${pre}recipient_id,
          ${pre}author_id,
          ${pre}content_metadata,
          ${pre}text,
          ${pre}modified_date);
        `;
      case 'SELECT':
        return `kind, created_date, is_deleted, recipient_id, author_id, content_metadata, text, modified_date FROM public.newsfeed ${t === '' ? '' : ' AS ' + t}`;
      default:
        return '*';
    }
  },

  values: (t, { createdDate, kind, isDeleted, authorId, recipientId, contentMetadataId, text, modifiedDate, id }, query) => {
    const pre = t == null || t === '' ? '' : `${t}.`;
    switch(query) {
      case 'INSERT':
        return `(
          ${createdDate},
          ${kind},
          ${isDeleted},
          ${authorId},
          ${contentMetadataId},
          '${text},
          ${modifiedDate},
          ${recipientId}
        )`;
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
});
