import multiparty from 'multiparty';

import { UserService } from '../services';
import config from '../../config';

const image = require('../../util/gcloud-util')(config.gcloud, config.cloudImageStorageBucket);
const bcrypt = require('bcrypt-nodejs');

module.exports = function userApi(app, options, prefix) {
  const userService = new UserService(options);

  /** *PICTURES API* **/


  // Currently only works with one picture. No mass upload.
  const uploadPicture = (req, res, next) => {
    const form = new multiparty.Form({ maxFieldsSize: (50 * 1024 * 1024) });

    form.on('part', (part) => {
      form.handlePart(part);
    });

    form.parse(req, (err, fields) => {
      if (!fields) {
        next(null);
        return;
      }

      const buffer = new Buffer(fields[Object.keys(fields)[0]], 'base64');
      const splits = Object.keys(fields)[0].split('.');

      image.sendUploadToGCS(splits[splits.length - 1], buffer)
      .then((response) => {
        next(response);
      })
      .catch((error) => {
        console.log(error);
        next(null);
      });
    });
  };

  app.get(`${prefix}/users/me`, options.auth, (req, res) => {
    res.redirect(`/user/${req.user.id}`);
  });

  app.get(`${prefix}/users/search/{text}`, options.auth, (req, res) => {
    if (req.params.text.length === 0) {
      res.status(400).send();
    } else {
      // elasticsearch for users
    }
  });

  /** USER API **/

  app.post(`${prefix}/users/edit`, options.auth, options.auth, (req, res) => {
    options.connect(options.database, (connection) => {
      console.log(connection);
    });
    res.send('lol');
  });

  app.post(`${prefix}/register`, (req, res) => {
    if (req.body.email == null || req.body.password == null) {
      res.status(400).json({ badRequest: 'empty username or password' });
      return;
    }

    if (req.body.firstName == null || req.body.lastName == null) {
      res.status(400).json({ badRequest: 'empty firstname or lastname' });
      return;
    }

    bcrypt.hash(req.body.password, null, null, (err, password) => {
      if (err) {
        res.status(500).send();
        return;
      }

      userService.registerUser(req.body.email, password, req.body.firstName, req.body.lastName)
        .then(user => res.json(user))
        .catch(error => res.status(500).json(error));
    });
  });

  app.post(`${prefix}/users/:userId/profile`, options.auth, (req, res) => {
    if (req.user.id != req.params.userId) {
      res.status(400).send();
      return;
    }

    userService.updateProfile(req.body, req.user.id)
    .then(() => {
      res.status(201).send();
    });
  });

  app.get(`${prefix}/users/:id`, options.auth, (req, res) => {
    if (!req.user) {
      res.status(400).send();
      return;
    }

    userService.getUser(req.params.id)
      .then((user) => {
        if (user == null) {
          res.status(404).send();
          return;
        }

        res.send(user);
      });
  });

  app.post(`${prefix}/users/edit/picture/new`, options.auth, (req, res) => {
    if (!req.user) {
      res.status(400).send();
    }

    uploadPicture(req, res, (gcloudResponse) => {
      if (gcloudResponse == null) {
        res.status(500).send();
        return;
      }

      options.connect(options.database, (connection) => {
        const user = [];
        connection.client.query(`INSERT INTO pictures (user_id, filename, picture_type) VALUES (${req.user.id}, '${gcloudResponse.cloudStorageObject}', 1);`)
        .on('row', (row) => { user.push(row); })
        .on('error', (error) => { console.log(`error encountered ${error}`); })
        .on('end', () => {
          connection.done();
          res.status(200).send(gcloudResponse);
        });
      });
    });
  });

  app.post(`${prefix}/users/:userId/follow`, options.auth, (req, res) => {
    if (!req.user) {
      res.status(400).send();
    }

    if (req.user.id === parseInt(req.params.userId, 10)) {
      res.status(204).send();
    }

    options.connect(options.database, (connection) => {
      connection.client.query(`
        INSERT INTO followers (origin, destination)
        SELECT 1, 2
        WHERE
          NOT EXISTS (
            SELECT * FROM followers WHERE origin = ${req.user.id} AND destination = ${req.params.userId}
          );
      `).on('error', (error) => { console.log(`error following user: ${error}`); })
      .on('end', () => {
        connection.done();
        res.status(200).send();
      });
    });
  });
};
