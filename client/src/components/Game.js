import React, { Component, Fragment } from 'react'
import '../componentsCss/general.css'
import '../componentsCss/game.css'
import WithLoginControl from '../componentsHOC/WithLoginControl';
import Chat from './Chat';
import VisWithClass from './VisWithClass';

class Game extends Component {
  constructor(props) {
    super(props)

    this.state = {
      waiting: true,
      pseudo: localStorage.getItem('pseudo'),
      // False if spectator
      play: this.props.location.state ? false : true,
      // Players
      players: null,
      // Name of the player's turn
      turn: null,
      // Room number
      room: null,
      // Actual URL of game
      game: this.props.match.params.game,
      socket: this.props.socket
    }

    this.ref = React.createRef()
  }

  componentDidMount () {
    // EMIT :: Join a room
    this.props.socket.emit('join', this.state.game, this.state.play, this.state.pseudo)

    // RECEIVE :: Room number
    this.state.socket.on('roomNumber', res => {
      this.setState({
        room: res
      })
    })

    // RECEIVE :: Two players are in the room - Game starts
    this.props.socket.on('start', (players, starts) => {
      let isTurn = this.state.pseudo === starts ? true : false
      console.log(isTurn)
      this.setState({ waiting: false, players: players, turn: isTurn })
    })
  }

  componentWillUnmount () {
    // EMIT :: Leave a room
    this.props.socket.emit('leave', this.state.game, this.state.pseudo)
  }

  // Copy the URL to ClipBoard
  copy = (e) => {
    e.preventDefault()

    this.ref.current.select()
    document.execCommand('copy')
  }

  // Handle Return's button
  handleClickHome = () => {
    this.props.history.push("/");
  }

  // EMIT :: A player did a move
  move = (box) => {
    this.state.socket.emit('move', box, this.state.pseudo)
  }

  render () {
    if (this.state.waiting) {
      return (
        <div className='box'>
          <div class='elements'>
            <h1 id='room'>ROOM {this.state.room} </h1>

            <h2>URL:</h2>
            <input ref={this.ref} type='text' value={window.location.href} />
            <button className='copy' onClick={this.copy}>Copy Link</button>
            <button className='return' onClick={this.handleClickHome}>Return</button>
          </div>
        </div>
      )
    } else {
      return (
        <VisWithClass turn={this.state.turn} game={this.state.game} socket={this.props.socket}></VisWithClass>
      )
    }
  }
}

export default WithLoginControl(Game)
