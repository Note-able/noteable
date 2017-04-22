module.exports = function documentsApi(app, options) {
/** DOCUMENTS API **/

  // Retrieve all song documents owned by user
  app.get('/songs/user', options.auth, (req, res) => {
    if (!req.user) {
      res.status(400).send();
    } else {
      options.connect(options.database, (connection) => {
        const songs = [];
        connection.client.query(`SELECT id, title, description, date, modified, profiles FROM public.documents WHERE ${req.user.id} = ANY (SELECT unnest(profiles) from public.documents);`)
        .on('row', (row) => { songs.push(row); })
        .on('end', () => {
          res.send(songs);
          connection.done();
        });
      });
    }
  });

  app.get('/document/:documentId', options.auth, (req, res) => {
    if (!req.user) {
      res.status(400).send();
    }
    options.connect(options.database, (connection) => {
      const song = [];
      connection.client.query(`SELECT * FROM public.documents
        WHERE ${req.user.id} = ANY (SELECT unnest(profiles) from public.documents) AND ${req.params.documentId} = id;`)
      .on('row', (row) => { song.push(row); })
      .on('end', () => {
        if (song.length > 0) {
          res.send(song[0]);
          connection.done();
        }
        res.status(404).send();
      });
    });
  });

  app.post('/document/:documentId', options.auth, (req, res) => {
    if (!req.user) {
      res.status(400).send();
    }
    options.connect(options.database, (connection) => {
      const song = [];
      connection.client.query(`SELECT id, title, description, date, modified, profiles FROM public.documents
        WHERE ${req.user.id} = ANY (SELECT unnest(profiles) from public.documents) AND ${req.params.documentId} = id;`)
      .on('row', (row) => { song.push(row); })
      .on('error', (error) => { console.log(`error encountered ${error}`) })
      .on('end', () => {
        if (song.length > 0) {
          connection.client.query(`UPDATE public.documents SET contents = '${JSON.stringify(req.body)}', modified = current_timestamp
            WHERE ${req.user.id} = ANY (SELECT unnest(profiles) from public.documents) AND ${req.params.documentId} = id;`)
          .on('row', (row) => { song.push(row); })
          .on('end', () => {
            res.status(200).send();
            connection.done();
          });
        } else {
        // create the song
          connection.client.query(`INSERT INTO documents (contents, date, modified, profiles) VALUES ('${JSON.stringify(req.body)}', current_timestamp, current_timestamp, '{${req.user.id}}');`)
          .on('row', (row) => { song.push(row); })
          .on('end', () => {
            res.status(200).send();
            connection.done();
          });
        }
      });
    });
  });
};
