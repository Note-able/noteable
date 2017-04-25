import { eventMapper } from './model/eventDto';
import { UserService } from '../index';

export default class EventService {
  constructor(options) {
    this.options = options;
    this.m_userService = new UserService(options);
  }

  // TODO: Actually get them by location
  getEventsByLocation() {
    return new Promise((resolve, reject) => {
      this.options.connect(this.options.database, (connection) => {
        if (connection.client == null) {
          reject('Failed to connect to database.');
          return;
        }

        const events = [];
        connection.client.query(`
          SELECT * FROM events LIMIT 50;`)
          .on('row', (row) => { events.push(row); })
          .on('error', (error) => { reject(error); })
          .on('end', () => {
            connection.done();
            let userIds = events.map(event => event.user_id);
            userIds = [...new Set(userIds)];
            this.m_userService.getUsers(userIds, (users) => {
              const usersById = users.reduce((map, user) => { map[user.id]; return map; }, {});
              resolve(events.map((event) => { return eventMapper(event, usersById[event.user_id]); }));
            });
          });
      });
    });
  }

}
