'use strict';

var _services = require('../services');

var Formidable = require('formidable');
var config = require('../../config');
var image = require('../../util/gcloud-util')(config.gcloud, config.cloudImageStorageBucket);
var bcrypt = require('bcrypt-nodejs');

module.exports = function userApi(app, options) {
  var userService = new _services.UserService(options);

  /** *PICTURES API* **/

  // Currently only works with one picture. No mass upload.
  var uploadPicture = function uploadPicture(req, res, next) {
    var form = new Formidable.IncomingForm();
    form.maxFieldsSize = 50 * 1024 * 1024;

    form.onPart = function (part) {
      form.handlePart(part);
    };

    form.parse(req, function (err, fields) {
      var buffer = new Buffer(fields[Object.keys(fields)[0]], 'base64');
      var splits = Object.keys(fields)[0].split('.');

      image.sendUploadToGCS(splits[splits.length - 1], buffer).then(function (response) {
        console.log(response);
        next(response);
      }).catch(function (error) {
        console.log(error);
      });
    });
  };

  app.get('/user/me', options.auth, function (req, res) {
    res.redirect('/user/' + req.user.id);
  });

  app.get('/user/search/{text}', options.auth, function (req, res) {
    if (req.params.text.length === 0) {
      res.status(400).send();
    } else {
      // elasticsearch for users
    }
  });

  /** USER API **/

  app.post('/user/edit', options.auth, options.auth, function (req, res) {
    console.log(req.body); // <- standard for getting things out post.

    options.connect(options.database, function (connection) {
      console.log(connection);
    });
    res.send('lol');
  });

  app.post('/register', function (req, res) {
    console.log(req.body);
    if (req.body.email == null || req.body.password == null) {
      res.status(400).json({ badRequest: 'empty username or password' });
      return;
    }

    if (req.body.firstName == null || req.body.lastName == null) {
      res.status(400).json({ badRequest: 'empty firstname or lastname' });
      return;
    }

    bcrypt.hash(req.body.password, null, null, function (err, password) {
      if (err) {
        res.status(500).send();
        return;
      }

      userService.registerUser(req.body.email, password, req.body.firstName, req.body.lastName).then(function (user) {
        return res.json(user);
      }).catch(function (error) {
        return res.status(500).json(error);
      });
    });
  });

  app.post('/user/profile/:userId', options.auth, function (req, res) {
    if (req.user.id !== req.params.userId) {
      res.status(400).send();
      return;
    }

    userService.updateProfile(req.body, function () {
      res.status(201).send();
    });
  });

  app.get('/user/:id', options.auth, function (req, res) {
    if (!req.user) {
      res.status(400).send();
      return;
    }

    userService.getUser(req.params.id, function (user) {
      if (user == null) {
        res.status(404).send();
        return;
      }

      res.send(user);
    });
  });

  app.post('/user/edit/picture/new', options.auth, function (req, res) {
    if (!req.user) {
      res.status(400).send();
    }

    uploadPicture(req, res, function (gcloudResponse) {
      if (gcloudResponse == null) {
        res.status(500).send();
        return;
      }

      options.connect(options.database, function (connection) {
        var user = [];
        connection.client.query('INSERT INTO pictures (user_id, filename, picture_type) VALUES (' + req.user.id + ', \'' + gcloudResponse.cloudStorageObject + '\', 1);').on('row', function (row) {
          user.push(row);
        }).on('error', function (error) {
          console.log('error encountered ' + error);
        }).on('end', function () {
          connection.done();
          res.status(200).send(gcloudResponse);
        });
      });
    });
  });

  app.post('/user/follow/:userId', options.auth, function (req, res) {
    if (!req.user) {
      res.status(400).send();
    }

    if (req.user.id === parseInt(req.params.userId, 10)) {
      res.status(204).send();
    }

    options.connect(options.database, function (connection) {
      connection.client.query('\n        INSERT INTO followers (origin, destination)\n        SELECT 1, 2\n        WHERE\n          NOT EXISTS (\n            SELECT * FROM followers WHERE origin = ' + req.user.id + ' AND destination = ' + req.params.userId + '\n          );\n      ').on('error', function (error) {
        console.log('error following user: ' + error);
      }).on('end', function () {
        connection.done();
        res.status(200).send();
      });
    });
  });
};