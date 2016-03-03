'use strict';

module.exports = (server, options) => {
  const io = require('socket.io').listen(server);

  io.on('connection', (socket) => {
    socket.join(`${socket.request._query.context}`);
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('message', (message, callback) => {
      options.connect(options.database, (connection) => {
        let id = -1;
        connection.client
        .query(`INSERT INTO MESSAGES (content, user_id, document_id, destination_id, time_stamp)
           VALUES (
             '${message.message}',
             ${message.userId},
             ${message.documentId ? message.documentId : 'NULL'},
             ${message.destinationId ? message.destinationId : 'NULL'},
             now());
             SELECT LASTVAL();`)
        .on(`row`, (row) => {
          id = parseInt(row.lastval);
        }).on(`end`, () => {
          const fullMessage = Object.assign({}, message, {id: id});
          io.sockets.in(`${fullMessage.documentId}`).emit('incoming', fullMessage);
        });
      });
    });
  });
}
