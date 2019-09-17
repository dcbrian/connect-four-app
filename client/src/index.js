import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom'
import Home from './components/rooms/Home'
import Game from './components/rooms/Game'
import Join from './components/rooms/Join'
import Lobby from './components/rooms/Lobby'
import './index.css'

// Initializing Socketi.io Client
const socketClient = require('socket.io-client')()

socketClient.on('connect', () => {
  console.log('Connected to server!')
})

// All the differents Routes
const Root = () => (
  <BrowserRouter>
    <Switch>

      {/* Redirect to the Watch's page */}
      <Route exact path='/lobby' render={(props) => <Lobby {...props} socket={socketClient} />} />

      {/* Redirect to the Watch's page */}
      <Route exact path='/watch' render={(props) => <Join {...props} socket={socketClient} action={'watchRooms'} />} />

      {/* Redirect to the Join's page */}
      <Route exact path='/join' render={(props) => <Join {...props} socket={socketClient} action={'playRooms'} />} />

      {/* We initialize a game id and redirect to the Game's page */}
      <Route exact path='/generate' render={() => (<Redirect to={`/${Math.random().toString(36).substring(2, 15)}`} />)} />

      {/* Redirect to the Home' page */}
      <Route exact path='/' render={(props) => <Home {...props} socket={socketClient} />} />

      {/* Redirect to the Game's page if exists */}
      <Route path='/:game' render={(props) => <Game {...props} socket={socketClient} />} />

    </Switch>
  </BrowserRouter >
)

ReactDOM.render(<Root />, document.getElementById('root'))
