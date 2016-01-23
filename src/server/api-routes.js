module.exports = function (app, pg, options) {
  app.get('/database', function(req, res) {
    options.connect(options.database, function (connection){
      if(connection.status === 'SUCCESS'){
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
        connection.client
        .query("SELECT * FROM public.profile WHERE email = '" + req.user.id + "';")
        .on('row', function(row){
          user.push(row);
        }).on('end', function (result) {
          res.send(user);
        });
      }
    });
  });

  app.get('/user/{id}', options.auth, function(req, res) {
    if (req.user.id !== req.params.id) {
      res.status(404).send();
    } else {
      options.connect(options.database, function (connection) {
        const user = [];
        connection.client
        .query("SELECT * FROM public.profile AS profile INNER JOIN public.user AS user WHERE user.email = profile.email AND user.id = " + req.params.id + ";")
        .on('row', function(row) {
          user.push(row);
        }).on('end', function(result) {
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

  /**
  Events API
  **/

  app.get('/events/nearby/{location}', options.auth, function (req, res) {
    res.status(204).send();
    //how the hell do you search based on location?
  });

  app.get('/events/instrument/{instrument}/{index}', options.auth, function (req, res) {
    if (req.params.instrument.length === 0) {
      res.status(400).send();
    } else {
      let index = 0;
      if (req.params.index) {
        let index = req.params.index;
      }
      options.connect(options.database, function (connection) {
        const events = [];

        connection.client
        .query("SELECT * FROM public.events WHERE instrument = '" + req.params.instrument + "' LIMIT 10 OFFSET " + 10 * index + ";")
        .on('row', function (row) {
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

        connection.client
        .query("SELECT * FROM public.events WHERE user_id = " + req.params.userId + ";")
        .on('row', function (row) {
          events.push(row);
        }).on('end', function (result) {
          res.send(events);
        })
      })
    }
  })
}
