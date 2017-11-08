export const musicMapper = (dbMusic, dbTags = []) => (dbMusic == null ? null : {
  audioUrl: dbMusic.audio_url,
  author: dbMusic.author,
  coverUrl: dbMusic.cover_url,
  createdDate: dbMusic.created_date,
  modifiedDate: dbMusic.modified_date,
  description: dbMusic.description,
  duration: dbMusic.duration,
  id: dbMusic.id,
  name: dbMusic.name,
  size: dbMusic.size,
  isDeleted: !!dbMusic.is_deleted,
  tags: dbTags,
});

export const columns = (t, kind) => {
  switch (kind) {
  case 'INSERT':
    return 'music (audio_url, author_user_id, cover_url, created_date, modified_date, description, duration, name, size)';
  case 'SELECT':
    return `audio_url, author_user_id, cover_url, created_date, modified_date, description, duration, name, size, id, is_deleted FROM music ${t}`;
  default:
    return '*';
  }
};

export const values = async ({ audioUrl, authorUserId, coverUrl, description, duration, id, name, size }, kind, connection) => {
  switch (kind) {
  case 'UPDATE':
    return await connection.format('music SET modified_date = UTC_TIMESTAMP(), cover_url = :coverUrl, description = :description, name = :name',
      { coverUrl, description: description || '', name: name || '' });
  case 'INSERT':
    return await connection.format('(:audioUrl, :authorUserId, :coverUrl, UTC_TIMESTAMP(), UTC_TIMESTAMP(), :description, :duration, :name, :size)',
      { audioUrl: audioUrl || '', authorUserId, coverUrl, description: description || '', duration: duration || '', name: name || '', size: size || '' });
  default:
    return '';
  }
};
