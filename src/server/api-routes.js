'use strict';

const regex = new RegExp(/[\0\x08\x09\x1a\n\r"'\\\%]/g)
function escaper(char){
  const m = ['\\0', '\\x08', '\\x09', '\\x1a', '\\n', '\\r', "'", '"', '\\', '\\\\', '%'];
  const r = ['\\\\0', '\\\\b', '\\\\t', '\\\\z', '\\\\n', '\\\\r', "''", '""', '\\\\', '\\\\\\\\', '\\%'];
  return r[m.indexOf(char)];
};

module.exports = function (app, options) {
  app.get(`/database`, (req, res) => {
    options.connect(options.database, (connection) => {
      if(connection.status === `SUCCESS`){
        res.status(200).send();
      } else {
        res.status(500).send();
      }
    });
  });

  app.get(`/user/me`, options.auth, (req, res) => {
    res.redirect(`/user/${req.user.id}/profile`);
  });

  /*app.get(`/user/:id/profile`, options.auth, (req, res) => {
    if (req.user.id !== parseInt(req.params.id)) {
      res.status(404).send();
    } else {
      options.connect(options.database, (connection) => {
        const user = [];
        connection.client
        .query(`SELECT profile.id, email, profile.location, average_event_rating, instrument_name, documents.title, documents.id as documents_id
                FROM public.profile AS profile
                  JOIN public.documents AS documents ON profile.id = ANY(documents.profiles)
                  WHERE profile.id = ${req.params.id};`)
        .on(`row`, (row) => {
          user.push(row);
        }).on(`end`, () => {
          res.send(user);
          connection.fin();
        });
      });
    }
  });*/

  app.get(`/user/search/{text}`, options.auth, (req, res) => {
    if (req.params.text.length === 0) {
      res.status(400).send();
    } else {
      //elasticsearch for users
    }
  });

  /**USER API**/

  app.post(`/user/edit`, options.auth, (req, res) => {
    console.log(req.body) // <- standard for getting things out post.

    options.connect(options.database, (connection) => {
      console.log(connection);
    });
    res.send(`lol`);
  });

  app.get('/user/:id', options.auth, (req, res) => {
    if(!req.user) {
      res.status(400).send();
    }
    options.connect(options.database, (connection) => {
      const user = [];
      console.log(`SELECT * FROM public.profile WHERE ${req.params.id} = id;`);
      connection.client.query(`SELECT * FROM public.profile WHERE ${req.params.id} = id;`)
      .on(`row`, (row) => { user.push(row); })
      .on(`error`, (error) => { console.log(`error encountered ${error}`) })
      .on(`end`, () => {
        res.send(user[0]);
        connection.fin();
      });
    });
  });

  /**MESSAGES API***/

  app.get('/messages/:documentId/:index', options.auth, (req, res) => {
    options.connect(options.database, (connection) => {
      const messages = [];
      connection.client
      .query(`WITH documents AS
        (SELECT id FROM documents WHERE profiles @> '{${req.user.id}}'::int[])
        SELECT * FROM messages WHERE id > ${req.params.index} AND document_id = ${req.params.documentId} AND ${req.params.documentId} IN
        (SELECT id FROM documents) ORDER BY id DESC LIMIT 15;`)
      .on('error', (error) => {
        console.log(error);
      })
      .on('row', (row) => {
        messages.push(row);
      }).on('end', () => {
        res.send(messages.reverse());
        connection.fin();
      });
    });
  });

  /**
  Events API - consider moving the queries to elasticsearch to order by popularity of events and user ratings
  **/

  app.get('/api/events', (req, res) => {
    options.connect(options.database, (connection) => {
      let item;
      connection.client
      .query(`SELECT * FROM events WHERE id = ${req.query.eventId};`)
      .on('error', (error) => {
        res.status(404).send();
      }).on('row', (event) => {
        item = event;
      }).on('end', () => {
        res.status(200).send(item);
      });
    });
  });

  app.get('/api/events/nearby', (req, res) => {
    if (req.query.lat == null || req.query.lng == null || req.query.radius == null) {
      res.status(400).send({
        error: 'The request is missing some parameters'
      });
    }

    const maxLat = parseFloat(req.query.lat) + req.query.radius/69.172;
    const minLat = req.query.lat - req.query.radius/69.172;
    // compensate for degrees longitude getting smaller with increasing latitude
    const diff = req.query.radius/(Math.cos(req.query.lat)*69.172);
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

  app.get(`/events/nearby/{location}`, options.auth, (req, res) => {
    res.status(204).send();
    //how the hell do you search based on location?
  });

  //filter should be either host_average_rating OR event_committed_attendees
  app.get(`/events/filter/{type}/{instrument}/{index}/{filter}`, options.auth, (req, res) => {
    if (req.params.instrument.length === 0 && req.params.type.length === 0) {
      res.status(400).send();
    } else {
      let index = 0;
      let query = ``;

      if (req.params.instrument.length === 0) {
        query = `type = '${req.params.type}'`;
      } else if (req.params.type.length === 0) {
        query = `instrument '${req.params.instrument}'`;
      } else {
        query = `instrument '${req.params.instrument}' AND type = '${req.params.type}'`;
      }

      if (req.params.index) {
        index = req.params.index;
      }

      index = 10 * index;

      options.connect(options.database, (connection) => {
        const events = [];

        //doesn't currently exclusively get events that haven't happened yet.j
        connection.client
        .query(`SELECT * FROM public.events WHERE ${query} LIMIT 10 OFFSET ${index} ORDER BY ${req.params.filter} DESC;`)
        .on(`row`, (row) => {
          events.push(row);
        }).on(`end`, () => {
          res.send(events);
          connection.fin();
        });
      });
    }
  });

  app.get(`/events/user/{userId}`, options.auth, (req, res) => {
    if (!req.params.userId) {
      res.status(400).send();
    } else {
      options.connect(options.database, (connection) => {
        const events = [];

        connection.client
        .query(`SELECT * FROM public.events WHERE user_id = ${req.params.userId};`)
        .on(`row`, (row) => {
          events.push(row);
        }).on(`end`, () => {
          res.send(events);
          connection.fin();
        });
      });
    }
  });

/** DOCUMENTS API **/

  //Retrieve all song documents owned by user
  app.get('/songs/user', options.auth, (req, res) => {
    console.log(req.user);
    if(!req.user) {
      res.status(400).send();
    } else {
      options.connect(options.database, (connection) => {
        const songs = [];
        console.log(`SELECT * FROM public.documents WHERE ${req.user.id} = ANY (SELECT unnest(profiles) from public.documents);`);
        connection.client.query(`SELECT id, title, description, date, modified, profiles FROM public.documents WHERE ${req.user.id} = ANY (SELECT unnest(profiles) from public.documents);`)
        .on(`row`, (row) => { songs.push(row); })
        .on(`end`, () => {
          res.send(songs);
          connection.fin();
        });
      });
    }
  });

  app.get('/document/:documentId', options.auth, (req, res) => {
    if(!req.user) {
      res.status(400).send();
    }
    options.connect(options.database, (connection) => {
      const song = [];
      console.log('looking for document');
      connection.client.query(`SELECT * FROM public.documents
        WHERE ${req.user.id} = ANY (SELECT unnest(profiles) from public.documents) AND ${req.params.documentId} = id;`)
      .on(`row`, (row) => { song.push(row); })
      .on(`end`, () => {
        console.log(JSON.stringify(song));
        if(song.length > 0 ) {
          res.send(song[0]);
          connection.fin();
        }
        res.status(404).send();
      });
    });
  });

  app.post('/document/:documentId', options.auth, (req, res) => {
    console.log(`POSTing document  ${req.params.documentId}`);
    if(!req.user) {
      res.status(400).send();
    }
    options.connect(options.database, (connection) => {
      const song = [];
      connection.client.query(`SELECT id, title, description, date, modified, profiles FROM public.documents
        WHERE ${req.user.id} = ANY (SELECT unnest(profiles) from public.documents) AND ${req.params.documentId} = id;`)
      .on(`row`, (row) => { song.push(row); })
      .on(`error`, (error) => { console.log(`error encountered ${error}`) })
      .on(`end`, () => {
        if(song.length > 0){
          console.log(req.body)
          connection.client.query(`UPDATE public.documents SET contents = '${JSON.stringify(req.body)}', modified = current_timestamp
            WHERE ${req.user.id} = ANY (SELECT unnest(profiles) from public.documents) AND ${req.params.documentId} = id;`)
          .on(`row`, (row) => { song.push(row); })
          .on(`end`, () => {
            res.status(200).send();
            connection.fin();
          });
        } else {
        // create the song
          connection.client.query(`INSERT INTO documents (contents, date, modified, profiles) VALUES ('${JSON.stringify(req.body)}', current_timestamp, current_timestamp, '{${req.user.id}}');`)
          .on(`row`, (row) => { song.push(row); })
          .on(`end`, () => {
            res.status(200).send();
            connection.fin();
          });
        }
      });
      console.log(`query complete ${song}`);
    });
  });
}