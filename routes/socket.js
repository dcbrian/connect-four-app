const socket = require('socket.io')
const sharedsession = require('express-socket.io-session')
const logic = require('./board.js')

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
        socketIoRoom.board = logic.create2DArray(7)
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
        // EMIT To ROOM:: Game starts
        io.in('ROOM' + room).emit('start',
          // Array of players
          socketIoRoom.players,
          // Player who starts
          socketIoRoom.players[Math.round(Math.random())])
      }

      // EMIT :: Room number
      socket.emit('roomNumber', Object.keys(io.sockets.adapter.rooms)
        .filter(name => name.includes('ROOM'))
        .indexOf('ROOM' + room))

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
      socket.on('move', function (room, item, pseudo) {
        // EMIT :: Player's move to other clients in the room
        socket.to('ROOM' + room).emit('move', item)

        // Add move in the Board
        logic.fillBoard(socketIoRoom.board, (item + 7 * 3) / 7, pseudo)

        // Check for winner
        if (logic.hasWon(socketIoRoom.board, pseudo)) {
          // EMIT To ROOM:: A Player won the game
          io.in('ROOM' + room).emit('won', pseudo)
        }
      })
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
      console.log('client disconnected')
    })
  })

  return socket
}
