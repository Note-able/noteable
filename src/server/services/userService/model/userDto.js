export const UserDbHelper = () => ({
  userMapper: (dbUser) => {
    if (dbUser == null) {
      return null;
    }

    return {
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
    };
  },

  columns: (t, kind) => {
    const pre = t == null || t === '' ? '' : `${t}.`;
    return `${pre}id, ${pre}email, ${pre}location, ${pre}cover_url, ${pre}first_name, ${pre}last_name, ${pre}avatar_url, ${pre}bio, ${pre}zip_code, ${pre}profession`;
  }
});
