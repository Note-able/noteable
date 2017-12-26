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
        const [tagRows] = await connection.query(`
          SELECT t.id, t.name FROM music_tags mt
          INNER JOIN tags t
          ON mt.tag_id = t.id
          WHERE mt.music_id = :id;`, { id });

        resolve(musicMapper(rows[0], tagRows));
      } catch (error) {
        reject(error);
      }
      connection.destroy();
    });
  }

  getMusicByUser(userId, options) {
    return new Promise(async (resolve, reject) => {
      const connection = await this.options.connectToMysqlDb(this.options.mysqlParameters);
      try {
        const [rows] = await connection.query(`
        SELECT ${columns('m', 'SELECT')}
        WHERE m.author_user_id = :userId AND m.is_deleted = 0
        LIMIT :limit
        OFFSET :offset;`,
          {
            userId,
            limit: parseInt(options.limit || defaultMusicLimit, 10),
            offset: parseInt(options.offset || 0, 10),
          });

        resolve(rows.map(music => musicMapper(music)));
      } catch (error) {
        console.log(error);
        reject(error);
      }
      connection.destroy();
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

        const { tags = [] } = musicDto;

        if (tags.length) {
          const dbTags = [];
          for (let i = 0; i < tags.length; i++) {
            const tag = await this.getOrCreateTagByName(tags[i]);
            dbTags[i] = tag;
          }
  
          const tagsToInsert = dbTags.map(tag => [id, tag.id]);
          await connection.query('INSERT INTO music_tags (music_id, tag_id) VALUES ?;', [tagsToInsert]);
        }

        resolve(this.getMusic(id));
      } catch (error) {
        console.log(error);
        reject(error);
      }
      connection.destroy();
    });
  }

  // creates tag If Not Exists
  getOrCreateTagByName = async (name) => {
    const connection = await this.options.connectToMysqlDb(this.options.mysqlParameters);
    try {
      let id;
      const [rows] = await connection.query('SELECT * FROM tags WHERE name = :name;', { name });

      if (rows.length === 0) {
        const [insertRows] = await connection.execute('INSERT INTO tags (name) VALUES (:name);', { name });
        id = insertRows.insertId;
      } else {
        id = rows[0].id;
      }

      connection.destroy();
      return { id, name };
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  updateMusic(musicDto) {
    return new Promise(async (resolve, reject) => {
      const connection = await this.options.connectToMysqlDb(this.options.mysqlParameters);
      try {
        const { tags, id } = musicDto;
        await connection.execute(`
          UPDATE ${await values(musicDto, 'UPDATE', connection)}
          WHERE id = :id`,
          { id: musicDto.id });

        const [oldTagRows] = await connection.query(`
          SELECT t.id, t.name FROM music_tags mt
          INNER JOIN tags t
          ON mt.tag_id = t.id
          WHERE mt.music_id = :id;`, { id });

        const tagsToRemove = oldTagRows.filter(tag => !tags.includes(tag.name));
        await connection.query('DELETE FROM music_tags WHERE music_id = ? AND tag_id IN (?);', [ id, tagsToRemove.map(t => t.id) ]);

        const oldTagNames = oldTagRows.map(t => t.name);
        const tagsToAdd = tags.filter(tag => !oldTagNames.includes(tag));

        const dbTagsToAdd = [];
        for (let i = 0; i < tagsToAdd.length; i++) {
          dbTagsToAdd[i] = await this.getOrCreateTagByName(tagsToAdd[i]);
        }

        const tagsToInsert = dbTagsToAdd.map(tag => [id, tag.id]);
        await connection.query('INSERT INTO music_tags (music_id, tag_id) VALUES ?;', [tagsToInsert]);

        resolve(this.getMusic(musicDto.id));
      } catch (error) {
        console.log(error);
        reject(error);
      }
      connection.destroy();
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
      connection.destroy();
    });
  }
}
