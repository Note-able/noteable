export const userMapper = (dbUser) => (dbUser == null ? null : {
  avatarUrl: dbUser.avatar_url,
  coverImage: dbUser.cover_url,
  id: dbUser.id,
  email: dbUser.email,
  location: dbUser.location,
  firstName: dbUser.first_name,
  lastName: dbUser.last_name,
  bio: dbUser.bio,
  preferences: {
    instruments: dbUser.instruments.split(','),
    isLooking: dbUser.is_looking,
    displayLocation: dbUser.display_location,
  },
  zipCode: dbUser.zip_code,
});
