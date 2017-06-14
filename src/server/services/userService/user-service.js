import mysql from 'mysql2';

import { UserDbHelper } from './model/userDto';

const Users = UserDbHelper();

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

      let user = {};
      connection.client.query(`
        SELECT ${Users.columns('p', 'SELECT')} FROM public.profile p
        WHERE p.id = ${userId};
        
        SELECT * FROM public.instruments i
        WHERE i.user_id = ${userId};
        
        SELECT * FROM public.preferences pr
        WHERE pr.profile_id = ${userId};
      `)
      .on('row', (row) => {
        if (row.first_name || row.last_name) {
          user = { ...user, ...row };
        } else if (row.instruments) {
          user.instruments = row.instruments;
        } else {
          user = { ...user, ...row };
        }
      })
      .on('error', (error) => {
        console.log(`error encountered ${error}`);
        callback({ id: -1 });
      })
      .on('end', () => {
        if (user.length === 0) {
          callback({ id: -1 });
          return;
        }
        // user[0].profileImage = image.getPublicUrl(user[0].filename);
        connection.done();
        callback(Users.userMapper(user));
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

      const users = [];
      connection.client.query(`
        SELECT p.id, p.email, p.location, p.cover_url, p.first_name, p.last_name, p.avatar_url, p.bio, p.zip_code, p.profession FROM public.profile p
        WHERE p.id IN (${userIds.join(', ')});
        
        SELECT * FROM public.instruments i
        WHERE i.user_id IN (${userIds.join(', ')});

        SELECT * FROM public.preferences pr
        WHERE pr.profile_id IN(${userIds.join(', ')});
      `)
      .on('row', (row) => {
        if (row.first_name || row.last_name) {
          users[row.id] = { ...users[row.id], ...row };
        } else if (row.instruments) {
          users[row.user_id].instruments = row.instruments;
        } else {
          users[row.profile_id].is_looking = row.is_looking;
          users[row.profile_id].display_location = row.display_location;
        }
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
        connection.done();
        callback(Object.keys(users).map(id => Users.userMapper(users[id])));
      });
    });
  }

  updateProfile(profile, callback) {
    this.options.connect(this.options.database, (connection) => {
      connection.client.query(`
        UPDATE public.profile SET location = '${profile.location}', bio = $$${profile.bio}$$, cover_url = '${profile.coverImage}', first_name = '${profile.firstName}', last_name = '${profile.lastName}', avatar_url = '${profile.avatarUrl}', zip_code = ${profile.zipCode || 'NULL'}, profession = '${profile.profession}'
        WHERE id = ${profile.id};
        UPDATE public.instruments SET instruments = '${profile.preferences.instruments.toString()}'
        WHERE user_id = ${profile.id};
        UPDATE public.preferences SET is_looking = ${profile.preferences.isLooking || 'DEFAULT'}, display_location = ${profile.preferences.displayLocation || 'DEFAULT'}
        WHERE profile_id = ${profile.id};
        INSERT INTO public.preferences (is_looking, display_location, profile_id) SELECT ${profile.preferences.isLooking || 'false'}, ${profile.preferences.displayLocation || 'false'}, ${profile.id}
          WHERE NOT EXISTS (SELECT * FROM public.preferences WHERE profile_id = ${profile.id});
      `).on('error', (error) => {
        console.log(error);
      }).on('end', () => {
        connection.done();
        callback();
      });
    });
  }

  registerUser = async (email, password, firstName, lastName) => {
    return new Promise(async (resolve, reject) => {
      const connection = await this.options.connectToMysqlDb(this.options.mysqlParameters);
      await connection.beginTransaction((err) => {
        if (err) {
          reject(err);
        }
      });

      const insertUserSql = mysql.format(
        'INSERT INTO users (email, password) VALUES(?, ?);',
        [email, password],
      );
      let userId;
      try {
        const [rows, fields] = await connection.query(insertUserSql);
        userId = rows.insertId;
      } catch (err) {
        reject(err);
      }
      const insertProfileSql = mysql.format(
          'INSERT INTO profiles (email, user_id, first_name, last_name) VALUES (?, ?, ?, ?);',
          [email, userId, firstName, lastName],
        );
      let profileId;
      try {
        const [rows] = await connection.execute(insertProfileSql);
        profileId = rows.insertId;
      } catch (err) {
        reject(err);
      }
      try {
        await connection.commit();
      } catch (err) {
        connection.rollback();
        reject(err);
      }
      resolve(profileId);
    });
  }
}
