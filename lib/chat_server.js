var io = require ('socket.io');
var guestnumber = 1;
var nicknames = {};
var currentRooms = {};

function createChat(server) {
  io(server).on('connection', function (socket) {
    console.log("Connecting...")

    socket.on('joinRoom', function (data) {
      console.log(nicknames[socket.id]);
    });

    if (currentRooms[socket.id]) {
      var room = currentRooms[socket.id]
      socket.to(room).emit('nickname', { nickname: addGuest(socket) });
      var nickname = nicknames[socket.id]

      socket.to(room).broadcast.emit('newMessage', {
        message: nickname + " has joined the room",
        nickname: "Server"
      })

      socket.to(room).emit('allNames', { allNames: listAllNames() });
      socket.to(room).broadcast.emit('allNames', { allNames: listAllNames() });

      socket.to(room).on('message', function (data) {
        var msg = data["message"];
        nickname = nicknames[socket.id]
        socket.to(room).broadcast.emit('newMessage', { message: msg, nickname: nickname })
      });

      socket.on('disconnect', function () {
        socket.to(room).broadcast.emit('allNames', { allNames: listAllNames() });
        socket.to(room).broadcast.emit('newMessage', {
          message: nickname + " has disconnected",
          nickname: "Server"
        })
        delete nicknames[socket.id]
      });

      socket.on('nicknameChangeRequest', function (nameChange) {
        var nickname = nicknames[socket.id]
        var newNickname = nameChange["request"];

        if (isValidName(newNickname)) {
          socket.to(room).broadcast.emit('newMessage', {
            message: nickname + " is now known as " + newNickname,
            nickname: "Server"
          })

          nicknames[socket.id] = newNickname;
          socket.to(room).emit('nickname', { nickname: newNickname })
          socket.to(room).emit('allNames', { allNames: listAllNames() });
          socket.to(room).broadcast.emit('allNames', { allNames: listAllNames() });
        } else {
          socket.to(room).emit('rejectNameChange', { text: 'name change rejected' })
        }
      })
    } else {
      socket.emit('joinLobby');

      socket.on('joinRoom', function (data) {
        joinRoom(socket, data.newRoom);
      });
    }
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

function joinRoom(socket, room) {
  currentRooms[socket.id] = room
  socket.join(room)
  socket.emit('acceptToRoom', { room: room })
}

function changeRooms(socket, from, to) {
  socket.leave(from)
  currentRooms[socket.id] = to
  socket.join(room)
}

module.exports = createChat