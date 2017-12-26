
import multiparty from 'multiparty';
import { MediaService } from '../services';
import config from '../../config';

const audio = require('../../util/gcloud-util')(config.gcloud, config.cloudAudioStorageBucket);

module.exports = function musicApi(app, options, prefix) {
  const mediaService = new MediaService(options);

  /** MUSIC API **/
  /**
   * audioUrl, authorUserId, coverUrl, createdDate, description, durations, id, name, size
   */

  /** queryParams: limit, offset */

  app.post(`${prefix}/recordings`, options.auth, (req, res) => {
    const form = new multiparty.Form({ uploadDir: './uploads' });

    form.parse(req, (err, fields) => {
      if (!fields.file) {
        return res.status(400).json({ error: 'No file' });
      }
      const buffer = new Buffer(fields.file[0], 'base64');

      audio.sendUploadToGCS(fields.extension ? fields.extension[0] : '.mp3', buffer)
        .then((result) => {
          mediaService.createMusic({
            audioUrl: result.cloudStoragePublicUrl,
            authorUserId: req.user.id,
            name: fields.name ? fields.name[0] : '',
            size: fields.size ? fields.size[0] : '',
            description: fields.description ? fields.description[0] : '',
            tags: fields.tags,
          })
            .then((music) => {
              res.status(201).json(music);
            })
            .catch((error) => {
              res.status(500).json(error);
            });
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    });
  });

  app.get(`${prefix}/recordings`, options.auth, (req, res) => {
    if (!req.user) {
      return res.status(404).send();
    }

    const serviceOptions = { limit: req.query.limit, offset: req.query.offset  };

    mediaService.getMusicByUser(req.user.id, serviceOptions)
      .then(result => res.json(result))
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
  });

  app.get(`${prefix}/recordings/:recordingId`, options.auth, (req, res) => {
    if (!req.user) {
      return res.status(404).send();
    }

    mediaService.getMusic(req.params.recordingId)
      .then(result => res.json(result))
      .catch((error) => {
        console.log(error);
        res.status(500).error(error);
      });
  });

  app.patch(`${prefix}/recordings/:recordingId`, options.auth, (req, res) => {
    if (!req.user) {
      return res.status(404).send();
    }

    return mediaService.updateMusic({
      id: req.params.recordingId,
      authorUserId: req.user.id,
      description: req.body.description,
      name: req.body.name,
      size: req.body.size,
      tags: req.body.tags,
    })
      .then(result => res.status(200).json(result))
      .catch(error => res.status(500).json(error));
  });

  app.delete(`${prefix}/recordings/:recordingId`, options.auth, (req, res) => {
    if (!req.user) {
      return res.status(404).send();
    }

    return mediaService.deleteMusic(req.params.recordingId)
      .then(result => res.status(204).send())
      .catch(error => res.status(500).json(error));
  });
};
