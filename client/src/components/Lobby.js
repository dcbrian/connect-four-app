import React, { Component } from 'react'
import WithLoginControl from '../componentsHOC/WithLoginControl';

class Lobby extends Component {

  // Handle Play's button
  handleCreation = event => {
    this.props.history.push("/generate");
  }

  // Handle Join's button
  handleJoin = event => {
    this.props.history.push("/join");
  }
  // Handle Return's button
  handleClickHome = () => {
    this.props.history.push("/");
  }

  render () {
    return (
      <div className='box' >
        <div className='elements'>
          <h1>Lobby</h1>
          <button type='submit' onClick={this.handleCreation}>Create Game</button>
          <button type='submit' onClick={this.handleJoin}>Join Game</button>
          <button className='return' onClick={this.handleClickHome}>Return</button>
        </div>
      </div >
    )
  }
}

export default WithLoginControl(Lobby)
