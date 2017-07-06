import { musicMapper, columns, values } from './model/musicDto.js';

const defaultMusicLimit = 10;

export default class MusicService {
  constructor(options) {
    this.options = options;
  }

  getMusic(id) {
    return new Promise(async (resolve, reject) => {
      const connection = await this.options.connectToMysqlDb(this.options.mysqlParameters);
      try {
        const [rows] = await connection.query(`SELECT ${columns('m', 'SELECT')} WHERE m.id = :id;`, { id });
        resolve(musicMapper(rows[0]));
      } catch (error) {
        reject(error);
      }
    });
  }

  getMusicByUser(userId, options) {
    return new Promise(async (resolve, reject) => {
      const connection = await this.options.connectToMysqlDb(this.options.mysqlParameters);
      try {
        const [rows] = await connection.query(`
        SELECT ${columns('m', 'SELECT')}
        WHERE m.author_user_id = :userId
        LIMIT :limit
        OFFSET :offset;`,
          {
            userId,
            limit: parseInt(options.limit || defaultMusicLimit, 10),
            offset: parseInt(options.offset || 0, 10),
          });

        resolve(rows.map(music => musicMapper(music)));
      } catch (error) {
        reject(error);
      }
    });
  }

  createMusic(musicDto) {
    return new Promise(async (resolve, reject) => {
      const connection = await this.options.connectToMysqlDb(this.options.mysqlParameters);
      try {
        const [rows] = await connection.execute(`
          INSERT INTO ${columns('', 'INSERT')}
          VALUES ${await values(musicDto, 'INSERT', connection)};`);
        const id = rows.insertId;
        resolve(this.getMusic(id));
      } catch (error) {
        reject(error);
      }
    });
  }

  updateMusic(musicDto) {
    return new Promise(async (resolve, reject) => {
      const connection = await this.options.connectToMysqlDb(this.options.mysqlParameters);
      try {
        await connection.execute(`
          UPDATE ${await values(musicDto, 'UPDATE', connection)}
          WHERE id = :id`,
          { id: musicDto.id });
        resolve(this.getMusic(musicDto.id));
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteMusic(id) {
    return new Promise(async (resolve, reject) => {
      const connection = await this.options.connectToMysqlDb(this.options.mysqlParameters);
      try {
        await connection.execute(`
          UPDATE music SET is_deleted = TRUE
          WHERE id = :id`,
          { id });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
