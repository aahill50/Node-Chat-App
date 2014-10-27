$(function () {
  var socket = ChatApp.socket = io();
  ChatApp.chat = new ChatApp.Chat(socket);
  ChatApp.nickname;
  ChatApp.room;

  socket.on('joinLobby', function () {
    ChatApp.room = 'lobby'
    $('#chat-container').addClass('inactive');
    $('#lobby-container').removeClass('inactive');
  })

  socket.on('acceptToRoom', function (data) {
    ChatApp.room = data.room
  })

  socket.on('allNames', function (names) {
    var $userList = $('#user-list');
    $userList.empty();
    names.allNames.forEach( function (name) {
      $el = $('<div>')
      $el.text(name)
      $userList.prepend($el);
    })
  });

  socket.on('nickname', function (nickname) {
    ChatApp.nickname = nickname["nickname"]
    $welcomeHeader = $('h1.welcome')
    $welcomeHeader.text( "Welcome to the Chat Node " + ChatApp.nickname + "!");
   });

  $(window).on("submit", function (event) {
    event.preventDefault();
    var $form;
    if (ChatApp.room === 'lobby') {
       $form = $('form.join-room-form');
    } else {
       $form = $('form.new-message-form');
    }
    var msg = getMessage($form);
    console.log($form)
    console.log(msg)
    sendMessage(msg, ChatApp.room);
    if (!isCommand(msg)) {
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

function getMessage($form) {
  var $msgEntry = $form.find('input[type=text]');
  var msg = $msgEntry.val();
  return msg
}

function sendMessage(message, room) {
  ChatApp.chat.sendMessage(message, room);
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

function isCommand(message) {
  return message[0] === "/"
}