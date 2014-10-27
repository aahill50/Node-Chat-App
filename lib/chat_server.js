var io = require ('socket.io');
var guestnumber = 1;
var nicknames = {};

function createChat(server) {
  io(server).on('connection', function (socket) {
    socket.emit('nickname', { nickname: addGuest(socket) });

    socket.emit('allNames', { allNames: listAllNames() });

    socket.on('message', function (data) {
      var msg = data["message"];
      var nickname = nicknames[socket.id]
      socket.broadcast.emit('newMessage', { message: msg, nickname: nickname })
    });

    socket.on('disconnect', function () {
      console.log(socket.id)
      delete nicknames[socket.id]
      // nicknames.delete(socket.id)
    });

    socket.on('nicknameChangeRequest', function (nameChange) {
      nickname = nameChange["request"];

      if (isValidName(nickname)) {
        nicknames[socket.id] = nickname;
        socket.emit('nickname', { nickname: nickname })
      } else {
        socket.emit('rejectNameChange', { text: 'name change rejected' })
      }
    })
  });
}

function addGuest(socket) {
  return nicknames[socket.id] = "guest" + guestnumber++;
}

function listAllNames() {
  names = [];
  for (var guest in nicknames) {
    names.push(nicknames[guest])
  }

  return names;
}

function isValidName(newName) {
  var allNames = listAllNames();
  var isValid = true

  allNames.forEach( function (name) {
    if (newName === name) {
      isValid = false
    }
  });

  return isValid;
}

module.exports = createChat