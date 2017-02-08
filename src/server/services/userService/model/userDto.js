export const userMapper = (dbUser) => (dbUser == null ? null : {
  avatarUrl: dbUser.avatar_url,
  coverImage: dbUser.cover_url,
  id: dbUser.id,
  email: dbUser.email,
  location: dbUser.location,
  firstName: dbUser.first_name,
  lastName: dbUser.last_name,
  bio: dbUser.bio,
  profession: dbUser.profession,
  preferences: {
    instruments: dbUser.instruments == null ? [] : dbUser.instruments.split(','),
    isLooking: dbUser.is_looking,
    displayLocation: dbUser.display_location,
    preferredGenres: dbUser.preferred_genres,
  },
  zipCode: dbUser.zip_code,
});
