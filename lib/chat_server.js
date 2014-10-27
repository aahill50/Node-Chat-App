var io = require ('socket.io')

function createChat(server) {
  io(server).on('connection', function (socket) {
    socket.emit('message', { text: 'Ready for connections' });
    socket.on('message', function (data) {
      console.log( "Message: " + data );
    });
  });
}

module.exports = createChat