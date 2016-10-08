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
    this.options.connect(this.options.database, (connection) => {
      const user = [];
      connection.client.query(`
        SELECT p.id, p.email, p.location, p.name, p.bio, i.instruments FROM public.profile p, public.instruments i 
        WHERE p.id = i.user_id
        AND ${userId} = p.id;`)
      .on('row', (row) => { user.push(row); })
      .on('error', (error) => {
        console.log(`error encountered ${error}`);
        callback(null);
      })
      .on('end', () => {
        if (user.length === 0) {
          callback(null);
        }

        // user[0].profileImage = image.getPublicUrl(user[0].filename);
        connection.fin();
        callback(userMapper(user[0]));
      });
    });
  }

  /** { preferences: { instruments: [] },
  id: 1,
  email: 'sportnak@gmail.com',
  location: 'Bellingham, WA',
  average_event_rating: 4,
  user_id: 1,
  name: null,
  bio: '<p>asdfasdf</p>' } **/

  updateProfile(profile, callback) {
    this.options.connect(this.options.database, (connection) => {
      connection.client.query(`
        UPDATE public.profile SET location = '${profile.location}', bio = $$${profile.bio.replace('\'', '\\\'')}$$, name = '${profile.name}'
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
