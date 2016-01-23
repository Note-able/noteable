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
};