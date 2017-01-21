import { userMapper } from './model/userDto.js';

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
        return callback({ id: -1 });
      }

      const user = [];
      connection.client.query(`
        SELECT p.id, p.email, p.location, p.cover_url, p.name, p.avatar_url, p.bio FROM public.profile p
        WHERE p.id = ${userId};
        
        SELECT * FROM public.instruments i
        WHERE i.user_id = ${userId};`)
      .on('row', (row) => { user.push(row); })
      .on('error', (error) => {
        console.log(`error encountered ${error}`);
        callback({ id: -1 });
      })
      .on('end', () => {
        if (user.length === 0) {
          callback({ id: -1 });
          return;
        }
        user[0].instruments = user[1] != null ? user[1].instruments : '';
        // user[0].profileImage = image.getPublicUrl(user[0].filename);
        connection.fin();
        callback(userMapper(user[0]));
      });
    });
  }

  getUsers(userIds, callback) {
    if (userIds == null || userIds.length === 0) {
      callback({ id: -1 });
      return;
    }

    this.options.connect(this.options.database, (connection) => {
      if (connection.client == null) {
        return callback({ id: -1 });
      }

      const users = {};
      connection.client.query(`
        SELECT p.id, p.email, p.location, p.cover_url, p.name, p.avatar_url, p.bio FROM public.profile p
        WHERE p.id IN (${userIds.join(', ')});
        
        SELECT * FROM public.instruments i
        WHERE i.user_id IN (${userIds.join(', ')});`)
      .on('row', (row) => {
        if (row.name)
          users[row.id] = { ...row, instruments: '' };
        else
          users[row.user_id].instruments = row.instruments;
      })
      .on('error', (error) => {
        console.log(`error encountered ${error}`);
        callback({ id: -1 });
      })
      .on('end', () => {
        if (users.length === 0) {
          callback({ id: -1 });
          return;
        }

        // user[0].profileImage = image.getPublicUrl(user[0].filename);
        connection.fin();
        callback(Object.keys(users).map(id => userMapper(users[id])));
      });
    });
  }

  updateProfile(profile, callback) {
    this.options.connect(this.options.database, (connection) => {
      connection.client.query(`
        UPDATE public.profile SET location = '${profile.location}', bio = $$${profile.bio}$$, cover_url = '${profile.coverImage}', name = '${profile.name}', avatar_url = '${profile.avatarUrl}'
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

  registerUser(email, password) {
    return new Promise((resolve, reject) => {
      this.options.connect(this.options.database, (connection) => {
        let id;
        connection.client
        .query(`INSERT INTO public.user (email, password) VALUES ('${email}', '${password}') RETURNING ID;`)
        .on('row', row => { id = row; })
        .on('error', error => reject(error))
        .on('end', () => resolve(id));
      });
    });
  }
}
