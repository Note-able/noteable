export const DbMetadataHelper = () => ({
  map: dbMetadata => (dbMetadata == null ? null : {
    createdDate: dbMetadata.created_date,
    url: dbMetadata.url,
    musicId: dbMetadata.music_id,
    eventId: dbMetadata.event_id,
    id: dbMetadata.id,
  }),

  mapToDB: metadata => (metadata == null ? null : {
    created_date: metadata.createdDate,
    url: metadata.url,
    music_id: metadata.musicId,
    event_id: metadata.eventId,
    id: metadata.id,
  }),

  validateMetadata: metadata => true,

  updateQuery: (t, { createdDate, url, musicId, eventId, id }) => {
    const pre = t == null || t === '' ? '' : `${t}.`;
    return `UPDATE public.content_metadata SET
      created_date = ${createdDate},
      url = ${url},
      music_id = ${musicId},
      event_id = ${eventId},
      WHERE id = ${id};`;
  },

  columns: (t, kind) => {
    const pre = t == null || t === '' ? '' : `${t}.`;
    switch (kind) {
    case 'INSERT':
      return `public.content_metadata ${pre === '' ? t : 'AS ' + t}(
        ${pre}created_date,
        ${pre}url,
        ${pre}music_id,
        ${pre}event_id);
      `;
    case 'SELECT':
      return `created_date, url, music_id, event_id, id FROM public.content_metadata ${t === '' ? '' : ' AS ' + t}`;
    default:
      return '*';
    }
  },

  values: (t, { createdDate, url, musicId, eventId, id }, query) => {
    const pre = t == null || t === '' ? '' : `${t}.`;
    switch (query) {
    case 'INSERT':
      return `(
        ${createdDate},
        ${url},
        ${musicId},
        ${eventId},
        ${id}
      )`;
    default:
      return '';
    }
  },
});
