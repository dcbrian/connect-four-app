import React, { Component } from 'react'
import '../../index.css'
import '../../componentsCss/chat.css'
import '../../componentsCss/animation.css'

class Formulaire extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '',
      length: this.props.length
    }
  }

  createMessage = () => {
    console.log('nex message')
    const { addMessage, pseudo, length } = this.props
    const message = {
      pseudo,
      message: this.state.message
    }

    this.setState({ message: '', length })
    this.props.emit(message)
    addMessage(message)
  }

  handleSubmit = event => {
    event.preventDefault()
    this.createMessage()
  }

  handleChange = event => {
    this.setState({ message: event.target.value })
    this.setState({ length: this.props.length - event.target.value.length })
  }

  render () {
    return (
      <form className='form' onSubmit={this.handleSubmit}>
        <input
          value={this.state.message}
          onChange={this.handleChange}
          required
          maxLength={this.props.length}
        />
        <div className='info'>{this.state.length}</div>
        <button type='submit'>Envoyer</button>
      </form>
    )
  }
}

export default Formulaire
