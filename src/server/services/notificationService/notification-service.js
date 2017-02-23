import { dbNotificationMapper } from './model/notificationDto.js';

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

  createNotification({ createdDate, kind, isDeleted, recipientId, sourceId }) {

  }

  updateNotification({ createdDate, kind, isDeleted, recipientId, sourceId }) {
    
  }

  getNotification(id) {

  }

  getNotifications(ids, limit, notificationId) {

  }

  getNotificationsByUser(userId, limit, notificationId) {
    
  }

  deleteNotification(id) {

  }
}