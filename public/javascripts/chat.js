(function () {
  var ChatApp = window.ChatApp = ( window.ChatApp || {} );

  Chat = ChatApp.Chat = function (socket) {
    this.socket = socket;
    this.sendMessage = function (text) {
      socket.emit('text', { message: text })
    };
  }
}())
