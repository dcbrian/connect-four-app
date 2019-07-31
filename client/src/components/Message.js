import React from 'react'
import '../index.css'
import '../componentsCss/chat.css'
import '../componentsCss/animation.css'

const Message = ({ pseudo, message, isUser }) => {
  if (isUser(pseudo)) {
    return <p className='user-message'>{message}</p>
  } else {
    return (
      <p className='not-user-message'>
        <span style={{ fontSize: '16px', fontWeight: '900', color: 'black' }}>{pseudo}: </span>
        {message}
      </p >
    )
  }
}

export default Message
