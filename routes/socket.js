const socket = require('socket.io')
const sharedsession = require('express-socket.io-session')

module.exports = function (server, session) {
  const io = socket(server)

  // cookie-based express-session middleware
  io.use(sharedsession(session))

  // RECEIVE :: Client connecting to Socket.io
  io.sockets.on('connection', function (socket) {
    // Creates bugs to ask pseudo
    // Instead send pseudo with every events
    // RECEIVE :: Client asking to join a Socket.io Room
    // socket.on('pseudo', function (pseudo) {
    //   // Store in session
    //   socket.handshake.session.pseudo = pseudo
    //   socket.handshake.session.save()
    // })

    // RECEIVE :: Client asking to join a Socket.io Room
    socket.on('join', function (room, play, pseudo) {
      // Client joins the Room
      socket.join('ROOM' + room)

      let socketIoRoom = io.sockets.adapter.rooms['ROOM' + room]

      // Initialize Players / Online inside Socket.io Room
      if (socketIoRoom.online === undefined) {
        socketIoRoom.online = []
        socketIoRoom.players = []
      }

      //  Fill Players / Online inside Socket.io Room
      if (play && socketIoRoom.players.length < 2) {
        if (socketIoRoom.players.includes(pseudo)) {
          pseudo = pseudo + '2'
          socket.emit('duplicate', pseudo)
        }

        socketIoRoom.online.push(pseudo)
        socketIoRoom.players.push(pseudo)
      } else {
        socketIoRoom.online.push(pseudo)
      }

      if (socketIoRoom.players.length === 2) {
        console.log('two players')
        // EMIT To ROOM:: Game starts
        io.in('ROOM' + room).emit('start',
          // Array of players
          io.sockets.adapter.rooms['ROOM' + room].players,
          // Player who starts
          io.sockets.adapter.rooms['ROOM' + room].players[Math.round(Math.random())])
      }

      // EMIT :: Room number
      socket.emit('roomNumber', Object.keys(io.sockets.adapter.rooms)
        .filter(name => name.includes('ROOM'))
        .indexOf('ROOM' + room))
    })

    // RECEIVE :: Client leaving a Socket.io Room
    socket.on('leave', function (room, pseudo) {
      // Only remove from Online variable
      if (io.sockets.adapter.rooms['ROOM' + room]) {
        let index = io.sockets.adapter.rooms['ROOM' + room].online.indexOf(pseudo)
        if (index !== -1) {
          io.sockets.adapter.rooms['ROOM' + room].online.splice(index, 1)
        }
      }

      // Client leaves the Room
      socket.leave('ROOM' + room)
    })

    // RECEIVE :: Client making a move on the board
    socket.on('move', function (room, item) {
      socket.to('ROOM' + room).emit('move', item)
    })

    // RECEIVE :: Client asking for the List of Rooms as spectator
    socket.on('watchRooms', function (item) {
      // EMIT :: List of Rooms
      socket.emit('watchRooms', Object.keys(io.sockets.adapter.rooms)
        .filter(name => name.includes('ROOM'))
        .map(name => name.replace('ROOM', ''))
      )
    })

    // RECEIVE :: Client asking for the List of Rooms as player
    socket.on('playRooms', function (item) {
      // EMIT :: List of Rooms
      socket.emit('playRooms', Object.keys(io.sockets.adapter.rooms)
        .filter(name => name.includes('ROOM'))
        .filter(name => io.sockets.adapter.rooms[name].players.length < 2)
        .map(name => name.replace('ROOM', ''))
      )
    })

    // RECEIVE :: Client disconnecting from Socket.io
    socket.on('disconnect', function (socket) {
    })
  })

  return socket
}

// module.exports = function (int player) {

//   // horizontalCheck
//   for (int j = 0; j < getHeight() - 3 ; j++ ) {
//     for (int i = 0; i < getWidth(); i++) {
//       if (this.board[i][j] == player && this.board[i][j + 1] == player && this.board[i][j + 2] == player && this.board[i][j + 3] == player) {
//         return true;
//       }
//     }
//   }
//   // verticalCheck
//   for (int i = 0; i < getWidth() - 3 ; i++ ) {
//     for (int j = 0; j < this.getHeight(); j++) {
//       if (this.board[i][j] == player && this.board[i + 1][j] == player && this.board[i + 2][j] == player && this.board[i + 3][j] == player) {
//         return true;
//       }
//     }
//   }
//   // ascendingDiagonalCheck
//   for (int i = 3; i < getWidth(); i++) {
//     for (int j = 0; j < getHeight() - 3; j++) {
//       if (this.board[i][j] == player && this.board[i - 1][j + 1] == player && this.board[i - 2][j + 2] == player && this.board[i - 3][j + 3] == player)
//         return true;
//     }
//   }
//   // descendingDiagonalCheck
//   for (int i = 3; i < getWidth(); i++) {
//     for (int j = 3; j < getHeight(); j++) {
//       if (this.board[i][j] == player && this.board[i - 1][j - 1] == player && this.board[i - 2][j - 2] == player && this.board[i - 3][j - 3] == player)
//         return true;
//     }
//   }
//   return false;
// }
