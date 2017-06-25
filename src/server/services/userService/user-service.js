import mysql from 'mysql2';

import { UserDbHelper } from './model/userDto';

const Users = UserDbHelper();

export default class UserService {
  constructor(options) {
    this.options = options;
  }

  getUser = async (userId) => {
    return new Promise(async (resolve, reject) => {
      if (userId == null) {
        return resolve({ id: -1 });
      }

      try {
        const connection = await this.options.connectToMysqlDb(this.options.mysqlParameters);
        let user = {};
        let [rows] = await connection.query(`
          SELECT ${Users.columns('p', 'SELECT')} FROM profiles p
          WHERE p.id = :id;
        `, { id: userId });

        user = { ...rows[0] };

        [rows] = await connection.query(`
            SELECT * FROM profiles_instruments pi
              INNER JOIN instruments i
              ON i.id = pi.instrument_id
            WHERE pi.profile_id = :id;`, { id: userId });

        user.instruments = rows;

        [rows] = await connection.query(`
            SELECT * FROM preferences pr
            WHERE pr.profile_id = :id;`, { id: userId });

        user = { ...user, ...rows[0] };

        resolve(Users.userMapper(user));
      } catch (err) {
        reject(err);
      }
    });
  }

  getUsers = async (userIds, callback) => (
    new Promise(async (resolve, reject) => {
      if (userIds == null || userIds.length === 0) {
        resolve({ id: -1 });
        return;
      }

      const users = userIds.map(async id => (await this.getUser(id)));

      if (users.length === 0) {
        resolve({ id: -1 });
        return;
      }

      resolve(users);
    })
  );

  updateProfile = async (profile, id) => {
    return new Promise(async (resolve, reject)  => {
      try {
        const connection = await this.options.connectToMysqlDb(this.options.mysqlParameters);
        await connection.beginTransaction(err => reject(err));

        await connection.execute(`
          UPDATE profiles
          SET location = :location,
            bio = :bio,
            cover_url = :coverUrl,
            first_name = :firstName,
            last_name = :lastName,
            avatar_url = :avatarUrl,
            zip_code = :zipCode,
            profession = :profession
          WHERE id = :id;`,
          { location: profile.location || 'NULL',
            bio: profile.bio || 'NULL',
            coverUrl: profile.coverImage || 'NULL',
            firstName: profile.firstName || 'NULL',
            lastName: profile.lastName || 'NULL',
            avatarUrl: profile.avatarUrl || 'NULL',
            zipCode: profile.zipCode || 'NULL',
            profession: profile.profession || 'NULL',
            id,
          });

        const [rows] = await connection.query(`
          SELECT pi.instrument_id
          FROM profiles_instruments pi
          WHERE pi.profile_id = :id;`,
          { id });

        const instrumentSets = profile.instruments.reduce((obj, instrumentId) => {
          if (!rows.includes(instrumentId)) {
            obj.newInstrumentIds.push(instrumentId);
          }
          return obj;
        }, { newInstrumentIds: [], instrumentIdsToRemove: [] });

        rows.reduce((obj, instrumentId) => {
          if (!profile.instruments.includes(instrumentId)) {
            obj.instrumentIdsToRemove.push(instrumentId);
          }
          return obj;
        }, instrumentSets);

        for (const instrumentId of instrumentSets.newInstrumentIds) {
          await connection.execute(`
            INSERT INTO profiles_instruments (instrument_id, profile_id) VALUES (:instrumentId, :profileId)`,
            { instrumentId, profileId: id });
        }

        for (const instrumentId of instrumentSets.instrumentIdsToRemove) {
          await connection.execute(`
            DELETE FROM profiles_instruments WHERE instrument_id = :instrumentId AND profile_id = :profileId;`,
            { instrumentId, profileId: id });
        }

        await connection.execute(`
          UPDATE preferences SET is_looking = :isLooking, display_location = :displayLocation
          WHERE profile_id = :id;`,
          { isLooking: profile.preferences.isLooking ? 1 : 0, displayLocation: profile.preferences.displayLocation ? 1 : 0, id });

        await connection.execute(`
          INSERT INTO preferences (is_looking, display_location, profile_id) SELECT :isLooking, :displayLocation, :id
            WHERE NOT EXISTS (SELECT * FROM preferences WHERE profile_id = :id);`,
          { isLooking: profile.preferences.isLooking ? 1 : 0, displayLocation: profile.preferences.displayLocation ? 1 : 0, id });

        await connection.commit();
        resolve();
      } catch (err) {
        reject(err);
      }
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
