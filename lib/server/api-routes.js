'use strict';

module.exports = function (app, options) {
  app.get(`/database`, (req, res) => {
    options.connect(options.database, connection => {
      if (connection.status === `SUCCESS`) {
        res.status(200).send();
      } else {
        res.status(500).send();
      }
    });
  });

  app.get(`/user/me`, options.auth, (req, res) => {
    res.redirect(`/user/${ req.user.id }/profile`);
  });

  app.get(`/user/:id/profile`, options.auth, (req, res) => {
    if (req.user.id !== parseInt(req.params.id)) {
      res.status(404).send();
    } else {
      options.connect(options.database, connection => {
        const user = [];
        connection.client.query(`SELECT profile.id, email, profile.location, average_event_rating, instrument_name, documents.title, documents.id as documents_id
                FROM public.profile AS profile
                  JOIN public.instruments AS instruments ON instruments.profile_id = profile.id
                  JOIN public.documents AS documents ON profile.id = ANY(documents.profiles)
                  WHERE profile.id = ${ req.params.id };`).on(`row`, row => {
          user.push(row);
        }).on(`end`, () => {
          res.send(user);
          connection.fin();
        });
      });
    }
  });

  app.get(`/user/search/{text}`, options.auth, (req, res) => {
    if (req.params.text.length === 0) {
      res.status(400).send();
    } else {
      //elasticsearch for users
    }
  });

  /**POST USER**/

  app.post(`/user/edit`, options.auth, (req, res) => {
    console.log(req.body); // <- standard for getting things out post.

    options.connect(options.database, connection => {
      console.log(connection);
    });
    res.send(`lol`);
  });

  /**MESSAGES API***/

  app.get('/messages/:documentId/:index', options.auth, (req, res) => {
    options.connect(options.database, connection => {
      const messages = [];
      connection.client.query(`WITH documents AS 
        (SELECT id FROM documents WHERE profiles @> '{${ req.user.id }}'::int[])
        SELECT * FROM messages WHERE id > ${ req.params.index } AND document_id = ${ req.params.documentId } AND ${ req.params.documentId } IN 
        (SELECT id FROM documents) ORDER BY id DESC LIMIT 15;`).on('error', error => {
        console.log(error);
      }).on('row', row => {
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
        query = `type = '${ req.params.type }'`;
      } else if (req.params.type.length === 0) {
        query = `instrument '${ req.params.instrument }'`;
      } else {
        query = `instrument '${ req.params.instrument }' AND type = '${ req.params.type }'`;
      }

      if (req.params.index) {
        index = req.params.index;
      }

      index = 10 * index;

      options.connect(options.database, connection => {
        const events = [];

        //doesn't currently exclusively get events that haven't happened yet.j
        connection.client.query(`SELECT * FROM public.events WHERE ${ query } LIMIT 10 OFFSET ${ index } ORDER BY ${ req.params.filter } DESC;`).on(`row`, row => {
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
      options.connect(options.database, connection => {
        const events = [];

        connection.client.query(`SELECT * FROM public.events WHERE user_id = ${ req.params.userId };`).on(`row`, row => {
          events.push(row);
        }).on(`end`, () => {
          res.send(events);
          connection.fin();
        });
      });
    }
  });
};