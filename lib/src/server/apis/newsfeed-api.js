'use strict';

var _services = require('../services');

module.exports = function newsfeedApi(app, options) {
  var newsfeedService = new _services.NewsfeedService(options);

  /** Newsfeed API **/
  // app.post('/newsfeed', options.auth, (req, res) => {});
  /** queryParams: ids(optional) */
  // app.get('/newsfeed', options.auth, (req, res) => {});
  // app.get('/newsfeed/:itemId', options.auth, (req, res) => {});
  /** queryParams: ids(optional) */
  // app.post('/newsfeed/markread', options.auth, (req, res) => {});
  // app.post('/newsfeed/delete/{itemId}', options.auth, (req, res) => {});
  /*
      newsfeedDto {
        createdDate,
        modifiedDate,
        isDeleted,
        kind,
        id,
        text,
        authorId,
        recipientId,
        contentMetadata {
          id,
          url,
          musicId,
          eventId,
          createdDate
        }
      }
    */
  app.post('/newsfeed', options.auth, function (req, res) {
    if (req.user == null) {
      return res.status(404).send();
    }

    newsfeedService.createNewsfeedItem({
      createdDate: req.body.createdDate,
      modifiedDate: req.body.modifiedDate,
      kind: req.body.kind,
      text: req.body.text,
      authorId: req.body.authorId,
      destinationId: req.body.destinationId || 0,
      contentMetadata: {
        url: req.body.contentMetadata.url,
        musicId: req.body.contentMetadata.musicId,
        eventId: req.body.contentMetadata.eventId
      }
    }).then(function () {
      return res.status(201).send();
    }).catch(function (error) {
      return res.json(error);
    });
  });

  app.get('/newsfeed/:destinationId', options.auth, function (req, res) {
    if (req.user == null) {
      return res.status(404).send();
    }

    newsfeedService.getNewsfeed(req.params.destinationId, req.query.limit, req.query.offsetId).then(function (items) {
      return res.json(items);
    }).catch(function (error) {
      return res.json(error);
    });
  });
};