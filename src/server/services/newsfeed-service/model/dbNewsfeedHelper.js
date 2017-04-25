import { DbMetadataHelper } from './dbMetadataHelper.js';
const MetadataHelper = DbMetadataHelper();

export const DbNewsfeedHelper = () => ({
  map: (dbNewsfeed, contentMetadata) => (dbNewsfeed == null ? null : {
    createdDate: dbNewsfeed.created_date,
    kind: NewsItemKind[dbNewsfeed.kind],
    id: dbNewsfeed.id,
    isDeleted: dbNewsfeed.is_deleted,
    destinationId: dbNewsfeed.destination_id,
    status: dbNewsfeed.status,
    contentMetadata: MetadataHelper.map(contentMetadata),
    text: dbNewsfeed.text
  }),

  mapToDB: (newsfeed) => (newsfeed == null ? null : {
    id: newsfeed.id,
    created_date: newsfeed.createdDate,
    is_deleted: newsfeed.isDeleted,
    kind: NewsItemKind[newsfeed.kind],
    destination_id: newsfeed.destinationId,
    status: newsfeed.status,
    content_metadata: newsfeed.contentMetadata.id,
    text: newsfeed.text
  }),

  validateNewsItem: (newsfeed) => {
    return true;
  },

  updateQuery: ({ createdDate, kind, isDeleted, authorId, contentMetadataId, text, modifiedDate, id , destinationId}) => {
    return `UPDATE public.newsfeed SET
      created_date = ${createdDate},
      kind = '${kind},
      is_deleted = ${isDeleted},
      destination_id = ${destinationId},
      author_id = ${authorId},
      content_metadata = ${contentMetadataId},
      text = ${text},
      modified_date = ${modifiedDate}
      WHERE id = ${id};`;
  },

  columns: (kind, id) => {
    switch (kind) {
    case 'INSERT':
      return `public.newsfeed (
        kind,
        created_date,
        is_deleted,
        destination_id,
        author_id,
        content_metadata,
        text,
        modified_date);
      `;
    case 'SELECT':
      return `n.kind, n.created_date, n.is_deleted, n.destination_id, n.author, n.content_metadata, n.text, n.modified_date, m.event_id, m.music_id, m.url, m.id as metadata_id, n.id
      FROM public.newsfeed n 
      INNER JOIN public.content_metadata m 
      ON m.id = n.content_metadata`;
    default:
      return '*';
    }
  },

  values: ({ createdDate, kind, isDeleted, authorId, destinationId, contentMetadataId, text, modifiedDate, id }, query) => {
    switch (query) {
    case 'INSERT':
      return `(
        ${createdDate},
        ${kind},
        ${isDeleted || '0'},
        ${authorId},
        ${contentMetadataId},
        '${text},
        ${modifiedDate},
        ${destinationId}
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
    engagement: 2,
  },
});
