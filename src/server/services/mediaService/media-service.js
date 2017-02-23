import { musicMapper, columns, values } from './model/musicDto.js';
const defaultMusicLimit = 10;

export default class MusicService {
  constructor(options) {
    this.options = options;
  }

  getMusic(id) {
    return new Promise((resolve, reject) => {
      this.options.connect(this.options.database, (connection) => {
        let music;
        connection.client.query(
          `SELECT ${columns('m', 'SELECT')} WHERE m.id = ${id};`
        ).on('row', row => { music = row; })
        .on('error', error => reject(error))
        .on('end', () => resolve(musicMapper(music)));
      })
    });
  }

  getMusicByUser(userId, options) {
    return new Promise((resolve, reject) => {
      this.options.connect(this.options.database, connection => {
        const result = [];
        const query = `SELECT ${columns('m', 'SELECT')} WHERE m.author = ${userId}${' LIMIT ' + (options.limit || defaultMusicLimit)}${' OFFSET ' + (options.offset || 0)};`;
        console.log(query);
        connection.client.query(query)
          .on('row', row => result.push(row))
          .on('error', error => reject(error))
          .on('end', () => resolve(result));
      });
    });
  }

  createMusic(musicDto) {
    return new Promise((resolve, reject) => {
      this.options.connect(this.options.database, (connection) => {
        let id;
        connection.client.query(
          `INSERT INTO ${columns('', 'INSERT')} VALUES ${values('', musicDto, 'INSERT')} RETURNING ID;`
        ).on('row', row => { id = row; })
        .on('error', error => reject(error))
        .on('end', () => resolve(id));
      })
    });
  }
}
