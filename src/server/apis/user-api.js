import multiparty from 'multiparty';
import fs from 'fs';
import request from 'request-promise-native';

import { UserService } from '../services';
import config from '../../config';

const image = require('../../util/gcloud-util')(config.gcloud, config.cloudImageStorageBucket);
const bcrypt = require('bcrypt-nodejs');

const indexUser = async (user) => {
  const newUser = {
    fullname: `${user.first_name} ${user.last_name}`,
    ...user,
  };

  try {
    await request.put(`http://elastic:9200/beta-noteable/users/${user.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser) });
  } catch (error) {
    console.log(error);
  }
};

module.exports = function userApi(app, options, prefix) {
  const userService = new UserService(options);

  /** *PICTURES API* * */


  // Currently only works with one picture. No mass upload.
  const uploadPicture = (req, res, next) => {
    const form = new multiparty.Form({ maxFieldsSize: (50 * 1024 * 1024), uploadDir: './uploads' });

    form.parse(req, (err, fields, files) => {
      if (fields == null && files == null) {
        next(null);
        return;
      }

      files.file.forEach((file) => {
        try {
          const data = fs.readFileSync(`./${file.path}`);
          image.sendUploadToGCS(file.path.split('.')[1], data)
            .then((response) => {
              fs.unlink(file.path, () => { });
              next(response);
            })
            .catch((e) => {
              fs.unlink(file.path, () => { });
              next(null);
            });
        } catch (e) {
          fs.unlink(file.path);
        }
      });
    });
  };

  app.get(`${prefix}/users/me`, options.auth, (req, res) => {
    res.redirect(`/user/${req.user.id}`);
  });

  /** USER API * */

  app.post(`${prefix}/users/edit`, options.auth, options.auth, (req, res) => {
    options.connectToMysqlDb(options.database, (connection) => {
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
        .then(async (user) => {
          indexUser(user);
          res.json(user);
        })
        .catch(error => res.status(500).json(error));
    });
  });

  app.post(`${prefix}/users/:userId/profile`, options.auth, (req, res) => {
    if (req.user.id !== req.params.userId) {
      res.status(400).send();
      return;
    }

    userService.updateProfile(req.body, req.params.userId)
      .then(async () => {
        const user = await userService.getUser(req.params.userId);
        indexUser(user);

        res.status(202).send();
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

    uploadPicture(req, res, async (gcloudResponse) => {
      if (gcloudResponse == null) {
        res.status(500).send();
        return;
      }

      const connection = await options.connectToMysqlDb(options.mysqlParameters);
      const user = [];
      try {
        await connection.query(`INSERT INTO pictures (user_id, file_name, picture_type) VALUES (${req.user.id}, '${gcloudResponse.cloudStorageObject}', 1);`);
        await connection.commit();
        res.status(200).send(gcloudResponse);
      } catch (e) {
        console.log(e);
        res.status(500).send();
      }
    });
  });

  app.post(`${prefix}/users/:userId/follow`, options.auth, (req, res) => {
    if (!req.user) {
      res.status(400).send();
    }

    if (req.user.id === parseInt(req.params.userId, 10)) {
      res.status(204).send();
    }

    options.connectToMysqlDb(options.database, (connection) => {
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

  app.get(`${prefix}/admin/users/all`, options.auth, async (req, res) => {
    try {
      if (req.user.id !== 1) {
        res.status(404).send();
      }

      const connection = await options.connectToMysqlDb(options.mysqlParameters);
      const [count] = await connection.query(`
          SELECT COUNT(*) FROM profiles limit 100;
        `);

      Array(10).fill(0).forEach(async (_, index) => {
        const [rows] = await connection.query(`
          SELECT * FROM profiles ORDER BY id DESC LIMIT 100 OFFSET ${index * 100}
        `);

        for (const i in rows) {
          await indexUser({ ...rows[i] });
        }
      });
    } catch (err) {
      res.json(err);
    }
  });

  app.get(`${prefix}/users/search/:query`, options.auth, async (req, res) => {
    if (!req.user) {
      return res.status(400).send();
    }

    if (req.params.query == null || req.params.query === '') {
      return res.status(204).send();
    }

    try {
      let response = await request({
        method: 'POST',
        url: 'http://elastic:9200/beta-noteable/users/_search',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            match: {
              fullname: {
                query: req.params.query,
                fuzziness: '1',
              },
            },
          },
        }),
      });

      response = JSON.parse(response);

      // this might be a prime time to update the user data in the index.
      if (response.hits.total === 0) {
        return res.status(204).send();
      }

      /* eslint-disable no-underscore-dangle */
      return res.json(response.hits.hits.map(hit => ({
        order: hit._score,
        ...hit._source,
      })));
      /* eslint-enable */
    } catch (error) {
      return res.json(error);
    }
  });
};
