import { DbNotificationHelper } from './model/notificationDto.js';
const Notifications = DbNotificationHelper();

/**
 * constructor(options) {
    this.options = options;
  }

  createNotification({ createdDate, kind, isDeleted, recipientId, sourceId, status  })
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
    if (notificationDto.createdDate == null) {
      notificationDto.createdDate = Date.now();
    }

    if (notificationDto.status == null) {
      Notifications.Status[notificationDto.status.toLower()] = Notifications.Status.unread;
    }

    return new Promise((resolve, reject) => {
      let id;
      this.options.connect(this.options.database, (connection) => {
        connection.client.query(
          `INSERT INTO ${Notifications.columns('', 'INSERT')} VALUES ${Notifications.values('', notificationDto, 'INSERT')} RETURNING id;`
        ).on('row', (row) => { id = row; })
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

  markNotificationsAsRead(userId) {
    return new Promise((resolve, reject) => {
      this.options.connect(this.options.database, (connection) => {
        connection.client.query(
          `${Notifications.markRead('')} WHERE recipient_id = ${userId};`,
        );
      });
    });
  }

  getNotification(id) {
    return new Promise((resolve, reject) => {
      this.options.connect(this.options.database, (connection) => {
        let notification = null;
        connection.client.query(
          `SELECT ${Notifications.columns('', 'SELECT')} WHERE id = ${id};`,
        ).on('row', (row) => { notification = Notifications.map(row); })
        .on('error', error => reject(error))
        .on('end', () => resolve(notification));
      });
    });
  }

  getNotifications(ids, limit, status) {
    if (typeof status == 'undefined') {
      status = Notifications.Status.any;
    }

    status = Notifications.Status[status.toLower()];

    return new Promise((resolve, reject) => {
      this.options.connect(this.options.database, (connection) => {
        const notifications = [];
        connection.client.query(
          `SELECT ${Notifications.columns('', 'SELECT')}
            WHERE id in (${ids.toString()})
            ${status === Notifications.Status.any ? '' : `AND status = ${status}`}
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
      offset = offsetId;
    }

    status = Notifications.Status[status.toLower()];

    return new Promise((resolve, reject) => {
      this.options.connect(this.options.database, (connection) => {
        const notifications = [];
        connection.client.query(
          `SELECT ${Notifications.columns('', 'SELECT')} 
            WHERE recipient_id = ${userId} 
            AND id > ${offset}
            ${status === Notifications.Status.any ? '' : 'AND status = ' + status}
            LIMIT ${limit};`,
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
          `DELETE FROM public.notifications WHERE id = ${id};`,
        ).on('error', error => reject(error))
        .on('end', () => resolve());
      });
    });
  }
}
