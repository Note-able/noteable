module.exports = function (app, pg, options) {
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
    options.connect(options.database, function (connection) {
      if (connection.status === 'SUCCESS') {
        const user = [];
        connection.client.query("SELECT * FROM public.profile WHERE email = '" + req.user.id + "';").on('row', function (row) {
          user.push(row);
        }).on('end', function (result) {
          res.send(user);
        });
      }
    });
  });

  app.get('/user/{id}', options.auth, function (req, res) {
    if (req.user.id !== req.params.id) {
      res.status(404).send();
    } else {
      options.connect(options.database, function (connection) {
        const user = [];
        connection.client.query("SELECT * FROM public.profile AS profile INNER JOIN public.user AS user WHERE user.email = profile.email AND user.id = " + req.params.id + ";").on('row', function (row) {
          user.push(row);
        }).on('end', function (result) {
          res.send(user);
        });
      });
    }
  });

  app.get('/user/search/{text}', options.auth, function (req, res) {
    if (req.params.text.length === 0) {
      res.status(400).send();
    } else {
      //elasticsearch for users
    }
  });

  /**POST USER**/

  app.post('/user/edit', options.auth, function (req, res) {
    console.log(req.body); // <- standard for getting things out post.

    options.connect(options.database, function (connection) {});
  });

  /**
  Events API - consider moving the queries to elasticsearch to order by popularity of events and user ratings
  **/

  app.get('/events/nearby/{location}', options.auth, function (req, res) {
    res.status(204).send();
    //how the hell do you search based on location?
  });

  app.get('/events/filter/{type}/{instrument}/{index}', options.auth, function (req, res) {
    if (req.params.instrument.length === 0 && req.params.type.length === 0) {
      res.status(400).send();
    } else {
      var index = 0;
      var query = '';
      if (req.params.instrument.length == 0) {
        query = "type = '" + req.params.type + "'";
      } else if (req.params.type.length == 0) {
        query = "instrument '" + req.params.instrument + "'";
      } else {
        query = "instrument '" + req.params.instrument + "' AND type = '" + req.params.type + "'";
      }
      if (req.params.index) {
        var index = req.params.index;
      }
      options.connect(options.database, function (connection) {
        const events = [];

        connection.client.query("SELECT * FROM public.events WHERE " + query + " LIMIT 10 OFFSET " + 10 * index + ";").on('row', function (row) {
          events.push(row);
        }).on('end', function (result) {
          res.send(events);
        });
      });
    }
  });

  app.get('/events/user/{userId}', options.auth, function (req, res) {
    if (!req.params.userId) {
      res.status(400).send();
    } else {
      options.connect(options.database, function (connection) {
        const events = [];

        connection.client.query("SELECT * FROM public.events WHERE user_id = " + req.params.userId + ";").on('row', function (row) {
          events.push(row);
        }).on('end', function (result) {
          res.send(events);
        });
      });
    }
  });
};