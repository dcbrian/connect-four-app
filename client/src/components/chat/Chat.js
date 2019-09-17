import React, { Component } from 'react'
import Message from './Message'
import Formulaire from './Formulaire'
import '../../index.css'
import '../../componentsCss/chat.css'
import '../../componentsCss/animation.css'

import { CSSTransition, TransitionGroup } from 'react-transition-group'
class Chat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messages: {},
      pseudo: this.props.pseudo
    }
    this.messagesRef = React.createRef()
  }

  componentDidMount () {
    // Initializing all Socket.io listeners
    this.props.socket.on('message', message => {
      this.addMessage(message)
    })
  }

  isUser = pseudo => {
    return pseudo === this.state.pseudo
  }

  emitFunc = message => this.props.socket.emit('message', message)

  addMessage = message => {
    const messages = { ...this.state.messages }
    messages[`message-${Date.now()}`] = message
    Object.keys(messages)
      .slice(0, -15)
      .forEach(key => delete messages[key])

    this.setState({ messages })
  }

  componentDidUpdate () {
    const ref = this.messagesRef.current
    ref.scrollTop = ref.scrollHeight
  }

  render () {
    const messages = Object.keys(this.state.messages).map(key => (
      <CSSTransition timeout={300} classNames='fade' key={key}>
        <Message
          isUser={this.isUser}
          message={this.state.messages[key].message}
          pseudo={this.state.messages[key].pseudo}
        />
      </CSSTransition>
    ))
    return (
      <div className='chatbox'>
        <div className='messages' ref={this.messagesRef}>
          <TransitionGroup className='message'>{messages}</TransitionGroup>
        </div>
        <Formulaire
          length={140}
          pseudo={this.state.pseudo}
          addMessage={this.addMessage}
          emit={this.emitFunc}
        />
      </div>
    )
  }
}

export default Chat
