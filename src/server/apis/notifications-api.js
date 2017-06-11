import { NotificationService } from '../services';

const DEFAULT_QUERY_SIZE = 30;

module.exports = function notificationsApi(app, options, prefix) {
  const notificationService = new NotificationService(options);

  /** Notifications API **/
  // app.post('/notifications', options.auth, (req, res) => {});
  /** queryParams: ids(optional) */
  // app.get('/notifications', options.auth, (req, res) => {});
  // app.get('/notifications/:notificationId', options.auth, (req, res) => {});
  /** queryParams: ids(optional) */
  // app.post('/notifications/markread', options.auth, (req, res) => {});
  // app.post('/notifications/delete/{notificationId}', options.auth, (req, res) => {});

  /** body: { createdDate, kind, recipientId, sourceId, status  } */
  app.post(`${prefix}/notifications`, options.auth, (req, res) => {
    if (req.user == null) {
      res.status(404).send();
      return;
    }

    if (req.body.kind == null || req.body.recipientId == null || req.body.sourceId == null) {
      req.status(403).send();
    }

    notificationService.createNotification({
      kind: req.body.kind,
      recipientId: req.body.recipientId,
      sourceId: req.body.sourceId,
      status: req.body.status,
    })
      .then(() => {
        res.status(201).send();
      })
      .catch((error) => {
        res.json(error);
      });
  });

  /** queryParams(optional): ids, limit, offsetId, status */
  app.get(`${prefix}/notifications`, options.auth, (req, res) => {
    if (req.user == null) {
      res.status(404).send();
    }

    if (req.query != null && req.query.ids == null) {
      notificationService.getNotificationsByUser(req.user.id, req.query.limit || DEFAULT_QUERY_SIZE, req.query.offsetId || 0, req.query.status || 0)
       .then(notifications => res.json(notifications))
       .catch(error => res.json(error));
    } else {
      notificationService.getNotifications(req.query.ids, req.query.limit || DEFAULT_QUERY_SIZE, req.query.status || 0)
        .then(notifications => res.json(notifications))
        .catch(error => res.json(error));
    }
  });

  /** routeParams: notificationId */
  app.get(`${prefix}/notifications/:notificationId`, options.auth, (req, res) => {
    if (req.user == null) {
      res.status(404).send();
      return;
    }

    notificationService.getNotification(req.params.notificationId)
      .then(notification => res.json(notification))
      .catch(error => res.json(error));
  });

  /** queryParams: ids(optional) */
  app.post(`${prefix}/notifications/markread`, options.auth, (req, res) => {
    if (req.user == null) {
      res.status(404).send();
      return;
    }

    notificationService.markNotificationsAsRead(req.user.id, req.query.ids)
      .then(() => res.status(204).send())
      .catch(error => res.json(error));
  });

  /** routeParams: notificationId */
  app.post(`${prefix}/notifications/delete/:notificationId`, options.auth, (req, res) => {
    if (req.user == null) {
      res.status(404).send();
      return;
    }

    notificationService.deleteNotification(req.params.notificationId)
      .then(() => res.status(204).send())
      .catch(error => res.json(error));
  });
};
