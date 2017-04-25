import { EventService } from '../services';

const regex = new RegExp(/[\0\x08\x09\x1a\n\r"'\\%]/g);
function escaper(char) {
  const m = ['\\0', '\\x08', '\\x09', '\\x1a', '\\n', '\\r', "'", '"', '\\', '\\\\', '%'];
  const r = ['\\\\0', '\\\\b', '\\\\t', '\\\\z', '\\\\n', '\\\\r', "''", '""', '\\\\', '\\\\\\\\', '\\%'];
  return r[m.indexOf(char)];
}

module.exports = function eventsApi(app, options) {
  const eventService = new EventService(options);


  /** Events API - **/
  /* TODO: consider moving the queries to elasticsearch to order by popularity of events and user ratings */

  app.get('/api/events', (req, res) => {
    eventService.getEventsByLocation()
      .then((events) => {
        res.status(200).json(events);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });

  app.get('/api/events/nearby', (req, res) => {
    if (req.query.lat == null || req.query.lng == null || req.query.radius == null) {
      res.status(400).send({
        error: 'The request is missing some parameters',
      });
    }

    const maxLat = parseFloat(req.query.lat) + req.query.radius / 69.172;
    const minLat = req.query.lat - req.query.radius / 69.172;
    // compensate for degrees longitude getting smaller with increasing latitude
    const diff = req.query.radius / (Math.cos(req.query.lat) * 69.172);
    const maxLon = parseFloat(req.query.lng) + Math.abs(diff);
    const minLon = parseFloat(req.query.lng) - Math.abs(diff);

    options.connect(options.database, (connection) => {
      const events = [];
      connection.client
      .query(`
      WITH FirstCut AS (
        SELECT * FROM events WHERE
            cast(latitude as double precision) < ${maxLat} AND cast(latitude as double precision) > ${minLat}
            AND cast(longitude as double precision) < ${maxLon} AND cast(longitude as double precision) > ${minLon}
      )
      SELECT * FROM FirstCut WHERE
        sqrt(
          power(
            (cast(longitude as double precision) - ${req.query.lng})*
            (68.7*cos(radians(cast(latitude as double precision))))
          , 2) +
          power(
            (cast(latitude as double precision) - ${req.query.lat})*
            69.172
          , 2)
        ) < ${req.query.radius};
      `).on('error', (error) => {
        console.log(error);
      }).on('row', (row) => {
        events.push(row);
      }).on('end', () => {
        res.status(200).send(events);
      });
    });
  });

  app.post('/api/events/create', options.auth, (req, res) => {
    const event = req.body;
    options.connect(options.database, (connection) => {
      let eventId = -1;
      connection.client
      .query(`INSERT INTO events (name, notes, latitude, longitude, start_date, end_date, user_id) VALUES
        (
          '${event.eventName.replace(regex, escaper)}',
          '${event.notes.replace(regex, escaper)}',
          '${event.eventLatitude}',
          '${event.eventLongitude}',
          '${event.startDate}',
          '${event.endDate}',
          ${req.user.id}
        );
        SELECT LASTVAL();
      `).on('error', (error) => {
        console.log(`${error}`);
        res.status(500).send();
      }).on('row', (id) => {
        eventId = id;
      }).on('end', () => {
        console.log(eventId);
        res.status(200).send(eventId);
      });
    });
  });

  app.get('/events/nearby/{location}', options.auth, (req, res) => {
    res.status(204).send();
    // how the hell do you search based on location?
  });

  // filter should be either host_average_rating OR event_committed_attendees
  app.get('/events/filter/{type}/{instrument}/{index}/{filter}', options.auth, (req, res) => {
    if (req.params.instrument.length === 0 && req.params.type.length === 0) {
      res.status(400).send();
    } else {
      let index = 0;
      let query = '';

      if (req.params.instrument.length === 0) {
        query = `type = '${req.params.type}'`;
      } else if (req.params.type.length === 0) {
        query = `instrument '${req.params.instrument}'`;
      } else {
        query = `instrument '${req.params.instrument}' AND type = '${req.params.type}'`;
      }

      if (req.params.index) {
        index = req.params.index * 10;
      }

      options.connect(options.database, (connection) => {
        const events = [];

        // doesn't currently exclusively get events that haven't happened yet.j
        connection.client
        .query(`SELECT * FROM public.events WHERE ${query} LIMIT 10 OFFSET ${index} ORDER BY ${req.params.filter} DESC;`)
        .on('row', (row) => {
          events.push(row);
        }).on('end', () => {
          res.send(events);
          connection.done();
        });
      });
    }
  });

  app.get('/events/user/{userId}', options.auth, (req, res) => {
    if (!req.params.userId) {
      res.status(400).send();
    } else {
      options.connect(options.database, (connection) => {
        const events = [];

        connection.client
        .query(`SELECT * FROM public.events WHERE user_id = ${req.params.userId};`)
        .on('row', (row) => {
          events.push(row);
        }).on('end', () => {
          res.send(events);
          connection.done();
        });
      });
    }
  });
};
