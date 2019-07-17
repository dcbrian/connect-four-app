import React, { Component } from 'react'
export const MyContext = React.createContext()

class MyContextProvider extends Component {
  constructor (props) {
    super(props)

    this.state = {
      test: 'a'
    }
  }

  render () {
    return (
      <MyContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </MyContext.Provider>
    )
  }
}

export default MyContextProvider
