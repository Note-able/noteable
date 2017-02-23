export const musicMapper = (dbMusic) => (dbMusic == null ? null : {
  audioUrl: dbMusic.audio_url,
  author: dbMusic.author,
  coverUrl: dbMusic.cover_url,
  createdDate: dbMusic.created_date,
  description: dbMusic.description,
  duration: dbMusic.duration,
  id: dbMusic.id,
  name: dbMusic.name,
  size: dbMusic.size
});

export const columns = (t, kind) => {
  const pre = t == null || t === '' ? '' : `${t}.`;
  switch(kind) {
    case 'INSERT':
    case 'UPDATE':
      return `public.music ${pre === '' ? t : ''} (${pre + 'audio_url'}, ${pre + 'author'}, ${pre + 'cover_url'}, ${pre + 'created_date'}, ${pre + 'description'}, ${pre + 'duration'}, ${pre + 'name'}, ${pre + 'size'})`;
    case 'SELECT':
      return `audio_url, author, cover_url, created_date, description, duration, name, size, id FROM public.music ${t === '' ? '' : ' AS ' + t}`;
    default:
      return '*';
  }
};

export const values = (t, { audioUrl, author, coverUrl, createdDate, description, duration, id, name, size }, kind) => {
  const pre = t == null || t === '' ? '' : `${t}.`;
  switch(kind) {
    case 'INSERT':
      return `('${pre + audioUrl || ''}', ${pre + author}, '${pre + (coverUrl || '')}', '${pre + createdDate}', '${pre + (description || '')}', '${pre + (duration || '')}', '${pre + name || ''}', '${pre + size || ''}')`;
    default:
      return '';
  }
}
