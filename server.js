const express = require('express')
const app = express()
const server = require('http').Server(app)
const path = require('path')
const port = process.env.PORT || 8080

const session = require('express-session')({
  secret: 'justasecret',
  resave: true,
  saveUninitialized: true
})

// Use express-session middleware for express
app.use(session)

// Use Socket.io
require('./routes/socket')(server, session)

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

// Handles all requests that don't match the ones from the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'))
})

server.listen(port, () => {
  console.log('Listening on port ' + port)
})
