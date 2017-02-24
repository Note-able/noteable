import DbNotificationHelper from './model/notificationDto.js';
const Notifications = DbNotificationHelper();

/**
 * constructor(options) {
    this.options = options;
  }

  createNotification({ createdDate, kind, isDeleted, recipientId, sourceId })
  updateNotification({ createdDate, kind, isDeleted, recipientId, sourceId })
  getNotification(id)
  getNotifications(ids, limit, notificationId)
  getNotificationsByUser(userId, limit, notificationId)
  deleteNotification(id)
 */

export default class NotificationService {
  constructor(options) {
    this.options = options;
  }

  createNotification(notificationDto) {
    return new Promise((resolve, reject) => {
      let id;
      this.options.connect(this.options.database, (connection) => {
        connection.client.query(
          `INSERT INTO ${Notifications.columns('', 'INSERT')} VALUES ${values('', notificationDto, 'INSERT')} RETURNING id;`
        ).on('row', row => id = row)
        .on('error', error => reject(error))
        .on('end', () => resolve(id));
      });
    });
  }

  updateNotification(notificationDto) {
    return new Promise((resolve, reject) => {
      this.options.connect(this.options.database, (connection) => {
        connection.client.query(
          Notifications.updateQuery('', notificationDto)
        ).on('error', error => reject(error))
        .on('end', () => resolve());
      });
    });
  }

  getNotification(id) {
    return new Promise((resolve, reject) => {
      this.options.connect(this.options.database, (connection) => {
        let notification = null;
        connection.client.query(
          `SELECT ${Notifications.columns('', 'SELECT')} WHERE id = ${id};`
        ).on('row', row => notification = dbNotificationMapper(row))
        .on('error', error => reject(error))
        .on('end', () => resolve(notification));
      });
    });
  }

  getNotifications(ids, limit, status) {
    return new Promise((resolve, reject) => {
      this.options.connect(this.options.database, (connection) => {
        const notifications = [];
        connection.client.query(
          `SELECT ${Notifications.columns('', 'SELECT')}
            WHERE id in (${ids.toString()})
            ${status === Notifications.Status.Any ? '' : 'AND status = ' + status}
            LIMIT ${limit};`
        ).on('row', row => notifications.push(Notifications.dbNotificationMapper(row)))
        .on('error', error => reject(error))
        .on('end', () => resolve(notifications));
      });
    });
  }

  getNotificationsByUser(userId, limit, offsetId, status) {
    let offset = 0;
    if (offsetId !== 0) {
      offset = offsetId
    }

    return new Promise((resolve, reject) => {
      this.options.connect(this.options.database, (connection) => {
        const notifications = [];
        connection.client.query(
          `SELECT ${Notifications.columns('', 'SELECT')} 
            WHERE recipient_id = ${userId} 
            AND id > ${offset}
            ${status === Notifications.Status.Any ? '' : 'AND status = ' + status}
            LIMIT ${limit};`
        ).on('row', row => notifications.push(Notifications.dbNotificationMapper(row)))
        .on('error', error => reject(error))
        .on('end', () => resolve(notifications));
      });
    });
  }

  deleteNotification(id) {
    return new Promise((resolve, reject) => {
      this.options.connect(this.options.database, (connection) => {
        connection.client.query(
          `DELETE FROM public.notifications WHERE id = ${id};`
        ).on('error', error => reject(error))
        .on('end', () => resolve());
      });
    });
  }
}