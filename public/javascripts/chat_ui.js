var socket = io();
var chat = new ChatApp.Chat(socket);

function getMessage() {
  var $form = $('form.new-message-form');
  var msg = $form.find('.message-entry').val();
}

function sendMessage(message) {
  var msg = getMessage();
  chat.sendMessage(msg);
}

function addMessageToPage(msg) {
  console.log(msg)
}