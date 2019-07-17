import React, { Component } from 'react'
import '../componentsCss/general.css'
import '../componentsCss/game.css'
import WithLoginControl from '../componentsHOC/WithLoginControl';

class Game extends Component {
  constructor(props) {
    super(props)

    this.state = {
      waiting: true,
      pseudo: localStorage.getItem('pseudo'),
      play: this.props.location.state ? false : true,
      room: null,
      game: this.props.match.params.game,
      socket: this.props.socket
    }

    this.ref = React.createRef()
  }

  componentDidMount () {
    // console.log(this.props.location.state.type)
    // if (this.props.type) {
    //   this.setState({ type: this.props.type })
    // }

    // EMIT :: Join a room
    this.props.socket.emit('join', this.state.game, this.state.play, this.state.pseudo)

    // RECEIVE :: Room number
    this.state.socket.on('roomNumber', res => {
      this.setState({
        room: res
      })
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
        <canvas
          id='canvas'
          ref={this.myRef}
          width={(this.columns + 3) * this.size}
          height={400}
        />
      )
    }
  }
}

export default WithLoginControl(Game)
