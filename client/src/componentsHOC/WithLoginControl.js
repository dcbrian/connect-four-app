import React, { Component } from 'react'

const WithLoginControl = WrappedComponent => (
  class HOC extends Component {
    constructor(props) {
      super(props)

      this.state = {
        pseudo: null,
        redirectPseudo: false
      }
    }

    componentDidMount () {

      // Initializing Pseudo if exists
      let pseudo = localStorage.getItem('pseudo')

      if (pseudo) {
        this.setState({
          pseudo: pseudo,
          redirectPseudo: true
        })
      }
    }

    // Handle  Pseudo box's Submit
    handleSubmit = event => {
      event.preventDefault()
      localStorage.setItem('pseudo', this.state.pseudo);

      // EMIT :: Save Pseudo to Server
      this.props.socket.emit('pseudo', this.state.pseudo)

      this.setState({ redirectPseudo: true })
    }

    // Handle Pseudo box's Input
    handleChange = event => {
      this.setState({ pseudo: event.target.value })
    }

    render () {
      if (!this.state.redirectPseudo) {
        return (
          <div className='box' >
            <form className='elements' onSubmit={this.handleSubmit}>
              <h1>Connect 4</h1>
              <input
                type='text'
                value={this.state.pseudo}
                onChange={this.handleChange}
                placeholder="Player's name"
                pattern='[A-Za-z-]{1,}'
                required
              />
              <button type='submit'>Start</button>
            </form>
          </div >
        )
      } else {
        return (
          <WrappedComponent {...this.props} />
        )
      }
    }
  }
)

export default WithLoginControl
