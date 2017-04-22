'use strict';

var _services = require('../services');

var Formidable = require('formidable');
var config = require('../../config');
var audio = require('../../util/gcloud-util')(config.gcloud, config.cloudAudioStorageBucket);

module.exports = function musicApi(app, options) {
  var mediaService = new _services.MediaService(options);

  /** MUSIC API **/
  /**
   * audioUrl, author, coverUrl, createdDate, description, durations, id, name, size
   */

  /** queryParams: limit, offset */

  app.post('/recordings', options.auth, function (req, res) {
    var form = new Formidable.IncomingForm();
    form.uploadDir = '/uploads';

    form.parse(req, function (err, fields) {
      var buffer = new Buffer(fields.file, 'base64');
      audio.sendUploadToGCS(fields.extension ? fields.extension : '.mp3', buffer).then(function (result) {
        mediaService.createMusic({ audioUrl: result.cloudStoragePublicUrl, author: req.user.id, createdDate: new Date().toISOString(), name: fields.name, size: fields.size }).then(function (id) {
          res.status(201).json({ id: id });
        }).catch(function (error) {
          res.json(error);
        });
      }).catch(function (response) {
        console.log(response.error);
        res.status(500).send();
        return;
      });
    });
  });

  app.get('/recordings', options.auth, function (req, res) {
    if (!req.user) {
      return res.status(404).send();
    }

    var serviceOptions = { limit: req.query.limit, offset: req.query.offset };

    mediaService.getMusicByUser(req.user.id, serviceOptions).then(function (result) {
      return res.json(result);
    }).catch(function (error) {
      console.log(error);
      res.json(error);
    });
  });

  app.get('/recordings/:recordingId', options.auth, function (req, res) {
    if (!req.user) {
      return res.status(404).send();
    }

    mediaService.getMusic(req.params.recordingId).then(function (result) {
      return res.json(result);
    }).catch(function (error) {
      console.log(error);
      res.error(error);
    });
  });

  app.patch('/recordings/:id', options.auth, function (req, res) {
    if (!req.user) {
      return res.status(404).send();
    }

    // TODO: Add recoridng update
  });

  app.delete('/recordings/:id', options.auth, function (req, res) {
    if (!req.user) {
      return res.status(404).send();
    }

    // TODO: Add Delete recording
  });
};