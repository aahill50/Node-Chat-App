$(function () {
  var socket = ChatApp.socket = io();
  ChatApp.chat = new ChatApp.Chat(socket);
  ChatApp.nickname;

  socket.on('allNames', function (names) {
    var $userList = $('#user-list');
    names.allNames.forEach( function (name) {
      $userList.prepend(name);
    })
  });

  socket.on('nickname', function (nickname) {
    ChatApp.nickname = nickname["nickname"]
    $welcomeHeader = $('h1.welcome')
    $welcomeHeader.text( "Welcome to the Chat Node " + ChatApp.nickname + "!");
   });

  $(window).on("submit", function (event) {
    event.preventDefault();
    var msg = getMessage();
    if (msg) {
      sendMessage(msg);
      addMessageToPage(ChatApp.nickname, msg);
    }
    clearInput();
  });

  socket.on('rejectNameChange', function(text) {
    console.log(text);
  });

  socket.on('newMessage', function (response) {
    addMessageToPage(response["nickname"], response["message"]);
  })

})

function getMessage() {
  var $form = $('form.new-message-form');
  var $msgEntry = $form.find('.message-entry');
  var msg = $msgEntry.val();

  if(msg.slice(0,5) === "/nick") {
    var newNickname = msg.slice(6);
    ChatApp.socket.emit('nicknameChangeRequest', { request: newNickname });
    return null;
  } else {
    return msg
  }
}

function sendMessage(message) {
  ChatApp.chat.sendMessage(message);
}

function addMessageToPage(nickname, message) {
  var $msgContainer = $('#message-box');

  var $el = $('<div>')
  $el.addClass('chat-msg')
  $msgContainer.prepend($el)
  $el.text(nickname + " - " + message);
  return true
}

function clearInput() {
  var $form = $('form.new-message-form');
  var $msgEntry = $form.find('.message-entry');
  $msgEntry.val("");
  $msgEntry.focus();
}