const userMapper = (dbUser) => ({
  id: dbUser.id,
  email: dbUser.email,
  location: dbUser.location,
  name: dbUser.name,
  bio: dbUser.bio,
  preferences: {
    instruments: dbUser.instruments.split(','),
  },
});

export default class UserService {
  constructor(options) {
    this.options = options;
  }

  getUser(userId, callback) {
    if (userId == null) {
      callback({ id: -1 });
      return;
    }

    this.options.connect(this.options.database, (connection) => {
      if (connection.client == null) {
        return callback({ id: -1});
      }

      const user = [];
      connection.client.query(`
        SELECT p.id, p.email, p.location, p.name, p.bio, i.instruments FROM public.profile p, public.instruments i 
        WHERE p.id = i.user_id
        AND ${userId} = p.id;`)
      .on('row', (row) => { user.push(row); })
      .on('error', (error) => {
        console.log(`error encountered ${error}`);
        callback({ id: -1 });
      })
      .on('end', () => {
        if (user.length === 0) {
          callback({ id: -1 });
        }

        // user[0].profileImage = image.getPublicUrl(user[0].filename);
        connection.fin();
        callback(userMapper(user[0]));
      });
    });
  }

  updateProfile(profile, callback) {
    this.options.connect(this.options.database, (connection) => {
      connection.client.query(`
        UPDATE public.profile SET location = '${profile.location}', bio = $$${profile.bio}$$, name = '${profile.name}'
        WHERE id = ${profile.id};
        UPDATE public.instruments SET instruments = '${profile.preferences.instruments.toString()}'
        WHERE user_id = ${profile.id};
      `).on('error', (error) => {
        console.log(error);
      }).on('end', () => {
        callback();
      });
    });
  }
}
