import { MediaService } from '../services';
import config from '../../config';

const Formidable = require('formidable');
const audio = require('../../util/gcloud-util')(config.gcloud, config.cloudAudioStorageBucket);

module.exports = function musicApi(app, options, prefix) {
  const mediaService = new MediaService(options);

  /** MUSIC API **/
  /**
   * audioUrl, authorUserId, coverUrl, createdDate, description, durations, id, name, size
   */

  /** queryParams: limit, offset */

  app.post(`${prefix}/recordings`, options.auth, (req, res) => {
    const form = new Formidable.IncomingForm();
    form.uploadDir = './uploads';

    form.parse(req, (err, fields) => {
      const buffer = new Buffer(fields.file, 'base64');

      audio.sendUploadToGCS(fields.extension ? fields.extension : '.mp3', buffer)
        .then((result) => {
          mediaService.createMusic({ audioUrl: result.cloudStoragePublicUrl, authorUserId: req.user.id, name: fields.name, size: fields.size })
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
        res.json(error);
      });
  });

  app.get('/recordings/:recordingId', options.auth, (req, res) => {
    if (!req.user) {
      return res.status(404).send();
    }

    mediaService.getMusic(req.params.recordingId)
      .then(result => res.json(result))
      .catch((error) => {
        console.log(error);
        res.error(error);
      });
  });

  app.patch(`${prefix}/recordings/:id`, options.auth, (req, res) => {
    if (!req.user) {
      return res.status(404).send();
    }

    // TODO: Add recoridng update
  });

  app.delete(`${prefix}/recordings/:id`, options.auth, (req, res) => {
    if (!req.user) {
      return res.status(404).send();
    }

    // TODO: Add Delete recording
  });
};
