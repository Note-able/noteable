export const musicMapper = dbMusic => (dbMusic == null ? null : {
  audioUrl: dbMusic.audio_url,
  author: dbMusic.author,
  coverUrl: dbMusic.cover_url,
  createdDate: dbMusic.created_date,
  description: dbMusic.description,
  duration: dbMusic.duration,
  id: dbMusic.id,
  name: dbMusic.name,
  size: dbMusic.size,
});

export const columns = (t, kind) => {
  switch (kind) {
  case 'INSERT':
  case 'UPDATE':
    return 'music (audio_url, author_user_id, cover_url, created_date, description, duration, name, size)';
  case 'SELECT':
    return `audio_url, author_user_id, cover_url, created_date, description, duration, name, size, id FROM music ${t}`;
  default:
    return '*';
  }
};

export const values = async ({ audioUrl, authorUserId, coverUrl, description, duration, id, name, size }, kind, connection) => {
  switch (kind) {
  case 'INSERT':
    return await connection.format('(:audioUrl, :authorUserId, :coverUrl, UTC_TIMESTAMP(), :description, :duration, :name, :size)',
      { audioUrl: audioUrl || '', authorUserId, coverUrl, description: description || '', duration: duration || '', name: name || '', size: size || '' });
  default:
    return '';
  }
};
