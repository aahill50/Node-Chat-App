(function () {
  var ChatApp = window.ChatApp = ( window.ChatApp || {} );

  Chat = ChatApp.Chat = function (socket) {
    this.socket = socket;
    this.sendMessage = function (text, room) {
      if (text[0] === "/") {
        console.log("received command")
        processCommand(text, socket)
      } else {
        socket.to(room).emit('message', { message: text })
      }
    };
  }
}())

processCommand = function (command, socket) {
  if (command.slice(0,5) === "/nick") {
    var newNickname = command.slice(6);
    ChatApp.socket.emit('nicknameChangeRequest', { request: newNickname });
  } else if (command.slice(0,5) === "/join") {
    var newRoom = command.slice(6);
    socket.emit('joinRoom', { newRoom: newRoom } )
  }
}
