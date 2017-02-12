import { musicMapper, columns, values } from './model/musicDto.js';

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

  createMusic(musicDto) {
    return new Promise((resolve, reject) => {
      this.options.connect(this.options.database, (connection) => {
        let id;
        console.log( `INSERT INTO ${columns('', 'INSERT')} VALUES ${values('', musicDto, 'INSERT')} RETURNING ID;`);
        connection.client.query(
          `INSERT INTO ${columns('', 'INSERT')} VALUES ${values('', musicDto, 'INSERT')} RETURNING ID;`
        ).on('row', row => { id = row; })
        .on('error', error => reject(error))
        .on('end', () => resolve(id));
      })
    });
  }
}
