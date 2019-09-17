import React, { Component } from 'react'
import '../../componentsCss/general.css'
import WithLoginControl from '../../componentsHOC/WithLoginControl'

class Home extends Component {

  // Handle Play's button
  handlePlay = event => {
    this.props.history.push("/lobby");
  }

  // Handle Watch's button
  handleWatch = event => {
    this.props.history.push("/watch");
  }

  render () {
    return (
      < div className='box' >
        <div className='elements'>
          <h1>Connect 4</h1>
          <button type='submit' onClick={this.handlePlay}>Play</button>
          <button type='submit' onClick={this.handleWatch}>Watch</button>
          <button type='submit'>Ladder</button>
        </div>
      </div >
    )
  }

}

export default WithLoginControl(Home)