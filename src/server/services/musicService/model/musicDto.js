export const musicMapper = (dbMusic) => (dbMusic == null ? null : {
  audioUrl: dbMusic.audio_url,
  author: dbMusic.author,
  coverUrl: dbMusic.cover_url,
  id: dbMusic.id,
  name: dbMusic.name,
  
});
