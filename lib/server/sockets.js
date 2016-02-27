'use strict';

module.exports = server => {
  const io = require('socket.io').listen(server);

  io.on('connection', socket => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('message', (message, callback) => {
      console.log(message);
      callback(1); //insert response message Id here.
    });
  });
};