'use strict';

var _services = require('./services');

var _userDto = require('./services/userService/model/userDto');

var _conversationDto = require('./services/messageService/model/conversationDto');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Formidable = require('formidable');
var config = require('../config');
var image = require('../util/gcloud-util')(config.gcloud, config.cloudImageStorageBucket);
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');

var regex = new RegExp(/[\0\x08\x09\x1a\n\r"'\\\%]/g);
function escaper(char) {
  var m = ['\\0', '\\x08', '\\x09', '\\x1a', '\\n', '\\r', "'", '"', '\\', '\\\\', '%'];
  var r = ['\\\\0', '\\\\b', '\\\\t', '\\\\z', '\\\\n', '\\\\r', "''", '""', '\\\\', '\\\\\\\\', '\\%'];
  return r[m.indexOf(char)];
};

module.exports = function (app, options) {
  var m_userService = new _services.UserService(options);
  var m_messageService = new _services.MessageService(options);
  var m_eventService = new _services.EventService(options);

  app.get('/database', function (req, res) {
    options.connect(options.database, function (connection) {
      if (connection.status === 'SUCCESS') {
        res.status(200).send();
      } else {
        res.status(500).send();
      }
    });
  });

  app.get('/user/me', options.auth, function (req, res) {
    res.redirect('/user/' + req.user.id);
  });

  app.get('/user/search/{text}', options.auth, function (req, res) {
    if (req.params.text.length === 0) {
      res.status(400).send();
    } else {
      //elasticsearch for users
    }
  });

  /**USER API**/

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

      m_userService.registerUser(req.body.email, password, req.body.firstName, req.body.lastName).then(function (user) {
        return res.json(user);
      }).catch(function (error) {
        return res.status(500).json(error);
      });
    });
  });

  app.post('/user/profile/:userId', options.auth, function (req, res) {
    if (req.user.id != req.params.userId) {
      res.status(400).send();
      return;
    }

    m_userService.updateProfile(req.body, function () {
      res.status(201).send();
    });
  });

  app.get('/user/:id', options.auth, function (req, res) {
    if (!req.user) {
      res.status(400).send();
      return;
    }

    m_userService.getUser(req.params.id, function (user) {
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

      image.sendUploadToGCS(Object.keys(fields)[0], buffer, function (response) {
        if (response && response.error) {
          return null;
        }

        next(response);
      });
    });
  };

  /** MESSAGES API ***/
  /**
   * MESSAGE {
   *  CONTENT
   *  ID
   *  SOURCE
   *  DESTINATION
   *  CONVERSATION
   * }
   * 
   * SEQUENCE CONVERSATION ID
   * 
   * CONVERSATION {
   *  USERID
   *  CONVERSATIONID
   *  LAST READ MESSAGE
   *  ID
   * }
   * 
   * GET CONVERSATION BY ID
   * GET CONVERSATIONS BY USER ID
   * GET MESSAGE BY ID
   * GET MESSAGES BY CONVERSATION ID
   * GET MESSAGE BY ID
   */

  app.post('/conversations', options.auth, function (req, res) {
    if (!req.user) {
      res.status(404).send();
      return;
    }

    var userIds = req.body.userIds.split(',');
    m_messageService.createConversation(userIds).then(function (conversationId) {
      res.status(201).json({ conversationId: conversationId });
    }).catch(function (error) {
      res.status(500).json(error);
    });
  });

  app.get('/conversations', options.auth, function (req, res) {
    if (!req.user) {
      res.status(404).send();
    } else {
      m_messageService.getConversationsByUserId(req.user.id).then(function (conversations) {
        var userIds = [].concat(_toConsumableArray(new Set(conversations.map(function (x) {
          return x.user_id;
        }))));
        m_userService.getUsers(userIds, function (users) {
          res.status(200).json((0, _conversationDto.conversationsMapper)(users, conversations));
        });
      }).catch(function (error) {
        res.status(500).json(error);
      });
    }
  });

  app.get('/conversation/:conversationId', options.auth, function (req, res) {
    if (!req.user) {
      res.status(404).send();
    } else if (req.params.conversationId == null) {
      res.status(400).send();
    } else {
      m_messageService.getConversation(req.params.conversationId, req.user.id).then(function (conversation) {
        // TODO: support groups or multiple userIds
        var userIds = [].concat(_toConsumableArray(new Set(conversation.messages.map(function (x) {
          return x.user_id;
        }))));
        m_userService.getUsers(userIds, function (users) {
          res.status(200).json((0, _conversationDto.conversationMapper)(users, conversation));
        });
      }).catch(function (error) {
        res.status(500).json(error);
      });
    }
  });

  app.get('/message/:messageId', options.auth, function (req, res) {
    if (!req.user) {
      res.status(404).send();
      return;
    }

    if (req.params.messageId == null) {
      res.status(400).send();
      return;
    }

    m_messageService.getMessage(req.params.messageId, req.user.id).then(function (message) {
      res.status(200).json(message);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  });

  app.get('/messages/:conversationId', options.auth, function (req, res) {
    if (req.user == null) {
      res.status(404).send();
    } else if (req.params.conversationId == null) {
      res.status(400).send();
    } else {
      m_messageService.getMessages(req.user.id, req.params.conversationId, req.query.start, req.query.count).then(function (messages) {
        res.status(200).json(messages);
      }).catch(function (error) {
        res.status(500).json(error);
      });
    }
  });

  app.post('/messages', options.auth, function (req, res) {
    if (!req.user) {
      res.status(404).send();
      return;
    }

    if (req.body.content == null || req.body.conversationId == null) {
      res.status(400).send();
      return;
    }

    m_messageService.createMessage(req.body.conversationId, req.body.userId, req.body.content, req.body.destinationId).then(function (messageId) {
      res.status(201).json({ messageId: messageId });
      return;
    }).catch(function (error) {
      res.status(500).json(error);
    });
  });

  app.delete('/message/:messageId', options.auth, function (req, res) {
    if (req.user == null) {
      res.status(404).send();
      return;
    } else if (req.params.messageId == null) {
      res.status(400).send();
    }

    m_messageService.deleteMessage(req.params.messageId).then(function (count) {
      res.status(200).json(count);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  });

  app.delete('/conversation/:conversationId', options.auth, function (req, res) {
    if (req.user == null) {
      res.status(404).send();
      return;
    } else if (req.params.conversationId == null) {
      res.status(400).send();
    }

    m_messageService.deleteConversation(req.params.conversationId).then(function (count) {
      res.status(200).json(count);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  });

  /**
  Events API - consider moving the queries to elasticsearch to order by popularity of events and user ratings
  **/

  app.get('/api/events', function (req, res) {
    m_eventService.getEventsByLocation().then(function (events) {
      res.status(200).json(events);
    }).catch(function (error) {
      res.status(500).send(error);
    });
  });

  app.get('/api/events/nearby', function (req, res) {
    if (req.query.lat == null || req.query.lng == null || req.query.radius == null) {
      res.status(400).send({
        error: 'The request is missing some parameters'
      });
    }

    var maxLat = parseFloat(req.query.lat) + req.query.radius / 69.172;
    var minLat = req.query.lat - req.query.radius / 69.172;
    // compensate for degrees longitude getting smaller with increasing latitude
    var diff = req.query.radius / (Math.cos(req.query.lat) * 69.172);
    var maxLon = parseFloat(req.query.lng) + Math.abs(diff);
    var minLon = parseFloat(req.query.lng) - Math.abs(diff);

    options.connect(options.database, function (connection) {
      var events = [];
      connection.client.query('\n      WITH FirstCut AS (\n        SELECT * FROM events WHERE\n            cast(latitude as double precision) < ' + maxLat + ' AND cast(latitude as double precision) > ' + minLat + '\n            AND cast(longitude as double precision) < ' + maxLon + ' AND cast(longitude as double precision) > ' + minLon + '\n      )\n      SELECT * FROM FirstCut WHERE\n        sqrt(\n          power(\n            (cast(longitude as double precision) - ' + req.query.lng + ')*\n            (68.7*cos(radians(cast(latitude as double precision))))\n          , 2) +\n          power(\n            (cast(latitude as double precision) - ' + req.query.lat + ')*\n            69.172\n          , 2)\n        ) < ' + req.query.radius + ';\n      ').on('error', function (error) {
        console.log(error);
      }).on('row', function (row) {
        events.push(row);
      }).on('end', function () {
        res.status(200).send(events);
      });
    });
  });

  app.post('/api/events/create', options.auth, function (req, res) {
    var event = req.body;
    options.connect(options.database, function (connection) {
      var eventId = -1;
      connection.client.query('INSERT INTO events (name, notes, latitude, longitude, start_date, end_date, user_id) VALUES\n        (\n          \'' + event.eventName.replace(regex, escaper) + '\',\n          \'' + event.notes.replace(regex, escaper) + '\',\n          \'' + event.eventLatitude + '\',\n          \'' + event.eventLongitude + '\',\n          \'' + event.startDate + '\',\n          \'' + event.endDate + '\',\n          ' + req.user.id + '\n        );\n        SELECT LASTVAL();\n      ').on('error', function (error) {
        console.log('' + error);
        res.status(500).send();
      }).on('row', function (id) {
        eventId = id;
      }).on('end', function () {
        console.log(eventId);
        res.status(200).send(eventId);
      });
    });
  });

  app.get('/events/nearby/{location}', options.auth, function (req, res) {
    res.status(204).send();
    //how the hell do you search based on location?
  });

  //filter should be either host_average_rating OR event_committed_attendees
  app.get('/events/filter/{type}/{instrument}/{index}/{filter}', options.auth, function (req, res) {
    if (req.params.instrument.length === 0 && req.params.type.length === 0) {
      res.status(400).send();
    } else {
      (function () {
        var index = 0;
        var query = '';

        if (req.params.instrument.length === 0) {
          query = 'type = \'' + req.params.type + '\'';
        } else if (req.params.type.length === 0) {
          query = 'instrument \'' + req.params.instrument + '\'';
        } else {
          query = 'instrument \'' + req.params.instrument + '\' AND type = \'' + req.params.type + '\'';
        }

        if (req.params.index) {
          index = req.params.index;
        }

        index = 10 * index;

        options.connect(options.database, function (connection) {
          var events = [];

          //doesn't currently exclusively get events that haven't happened yet.j
          connection.client.query('SELECT * FROM public.events WHERE ' + query + ' LIMIT 10 OFFSET ' + index + ' ORDER BY ' + req.params.filter + ' DESC;').on('row', function (row) {
            events.push(row);
          }).on('end', function () {
            res.send(events);
            connection.done();
          });
        });
      })();
    }
  });

  app.get('/events/user/{userId}', options.auth, function (req, res) {
    if (!req.params.userId) {
      res.status(400).send();
    } else {
      options.connect(options.database, function (connection) {
        var events = [];

        connection.client.query('SELECT * FROM public.events WHERE user_id = ' + req.params.userId + ';').on('row', function (row) {
          events.push(row);
        }).on('end', function () {
          res.send(events);
          connection.done();
        });
      });
    }
  });

  /** DOCUMENTS API **/

  //Retrieve all song documents owned by user
  app.get('/songs/user', options.auth, function (req, res) {
    if (!req.user) {
      res.status(400).send();
    } else {
      options.connect(options.database, function (connection) {
        var songs = [];
        connection.client.query('SELECT id, title, description, date, modified, profiles FROM public.documents WHERE ' + req.user.id + ' = ANY (SELECT unnest(profiles) from public.documents);').on('row', function (row) {
          songs.push(row);
        }).on('end', function () {
          res.send(songs);
          connection.done();
        });
      });
    }
  });

  app.get('/document/:documentId', options.auth, function (req, res) {
    if (!req.user) {
      res.status(400).send();
    }
    options.connect(options.database, function (connection) {
      var song = [];
      connection.client.query('SELECT * FROM public.documents\n        WHERE ' + req.user.id + ' = ANY (SELECT unnest(profiles) from public.documents) AND ' + req.params.documentId + ' = id;').on('row', function (row) {
        song.push(row);
      }).on('end', function () {
        if (song.length > 0) {
          res.send(song[0]);
          connection.done();
        }
        res.status(404).send();
      });
    });
  });

  app.post('/document/:documentId', options.auth, function (req, res) {
    if (!req.user) {
      res.status(400).send();
    }
    options.connect(options.database, function (connection) {
      var song = [];
      connection.client.query('SELECT id, title, description, date, modified, profiles FROM public.documents\n        WHERE ' + req.user.id + ' = ANY (SELECT unnest(profiles) from public.documents) AND ' + req.params.documentId + ' = id;').on('row', function (row) {
        song.push(row);
      }).on('error', function (error) {
        console.log('error encountered ' + error);
      }).on('end', function () {
        if (song.length > 0) {
          connection.client.query('UPDATE public.documents SET contents = \'' + JSON.stringify(req.body) + '\', modified = current_timestamp\n            WHERE ' + req.user.id + ' = ANY (SELECT unnest(profiles) from public.documents) AND ' + req.params.documentId + ' = id;').on('row', function (row) {
            song.push(row);
          }).on('end', function () {
            res.status(200).send();
            connection.done();
          });
        } else {
          // create the song
          connection.client.query('INSERT INTO documents (contents, date, modified, profiles) VALUES (\'' + JSON.stringify(req.body) + '\', current_timestamp, current_timestamp, \'{' + req.user.id + '}\');').on('row', function (row) {
            song.push(row);
          }).on('end', function () {
            res.status(200).send();
            connection.done();
          });
        }
      });
    });
  });
};