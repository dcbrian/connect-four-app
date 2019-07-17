const socket = require('socket.io')
const sharedsession = require('express-socket.io-session')

module.exports = function (server, session) {
  const io = socket(server)

  // cookie-based express-session middleware
  io.use(sharedsession(session))

  // RECEIVE :: Client connecting to Socket.io
  io.sockets.on('connection', function (socket) {
    // CREATES BUGS TO ASK ONCE FOR PSEUDO == RECEIVE :: Client asking to join a Socket.io Room
    // socket.on('pseudo', function (pseudo) {
    //   console.log('pseudo is ' + pseudo)

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
      if (play) {
        socketIoRoom.online.push(pseudo)
        socketIoRoom.players.push(pseudo)
      } else {
        socketIoRoom.online.push(pseudo)
      }

      if (socketIoRoom.players.length === 2) {
        // EMIT :: Game starts
        socket.emit('start', {
          'players': io.sockets.adapter.rooms['ROOM' + room].players,
          'start': Math.round(Math.random())
        })
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
    socket.on('move', function (item) {

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
      )
    })

    // RECEIVE :: Client disconnecting from Socket.io
    socket.on('disconnect', function (socket) {
    })
  })

  return socket
}
