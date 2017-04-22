'use strict';

var _services = require('../services');

var regex = new RegExp(/[\0\x08\x09\x1a\n\r"'\\%]/g);
function escaper(char) {
  var m = ['\\0', '\\x08', '\\x09', '\\x1a', '\\n', '\\r', "'", '"', '\\', '\\\\', '%'];
  var r = ['\\\\0', '\\\\b', '\\\\t', '\\\\z', '\\\\n', '\\\\r', "''", '""', '\\\\', '\\\\\\\\', '\\%'];
  return r[m.indexOf(char)];
}

module.exports = function eventsApi(app, options) {
  var eventService = new _services.EventService(options);

  /** Events API - consider moving the queries to elasticsearch to order by popularity of events and user ratings **/

  app.get('/api/events', function (req, res) {
    eventService.getEventsByLocation().then(function (events) {
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
    // how the hell do you search based on location?
  });

  // filter should be either host_average_rating OR event_committed_attendees
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
          index = req.params.index * 10;
        }

        options.connect(options.database, function (connection) {
          var events = [];

          // doesn't currently exclusively get events that haven't happened yet.j
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
};