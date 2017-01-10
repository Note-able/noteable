'use strict';

module.exports = function (server, options) {
  var io = require('socket.io').listen(server);

  io.on('connection', function (socket) {
    socket.join('' + socket.request._query.context);
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

    socket.on('message', function (message) {
      options.connect(options.database, function (connection) {
        var id = -1;
        connection.client.query('INSERT INTO MESSAGES (content, user_id, document_id, destination_id, time_stamp)\n           VALUES (\n             \'' + message.message + '\',\n             ' + message.userId + ',\n             ' + (message.documentId ? message.documentId : 'NULL') + ',\n             ' + (message.destinationId ? message.destinationId : 'NULL') + ',\n             now());\n             SELECT LASTVAL();').on('row', function (row) {
          id = parseInt(row.lastval);
        }).on('end', function () {
          var fullMessage = Object.assign({}, message, { id: id });
          io.sockets.in('' + fullMessage.documentId).emit('incoming', fullMessage);
        });
      });
    });
  });
};