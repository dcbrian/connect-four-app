import { CSSTransition, TransitionGroup } from 'react-transition-group'
import React, { Component } from 'react'
import '../componentsCss/animation.css'
import '../componentsCss/watch.css'
import WithLoginControl from '../componentsHOC/WithLoginControl';

class Join extends Component {
    constructor(props) {
        super(props)

        this.state = {
            rooms: {},
            socket: this.props.socket
        }

    }
    componentDidMount () {
        // EMIT :: List of Rooms
        this.state.socket.emit('playRooms', {})

        // Create interval to see new roms
        let interval = setInterval(() => {
            this.state.socket.emit('playRooms', {})
        }, 5000);

        // Save interval to state to access it later
        this.setState({ interval: interval });

        // RECEIVE :: List of rooms
        this.state.socket.on('playRooms', res => {
            this.setState({
                rooms: res
            })
        })
    }

    componentWillUnmount () {
        // Use state to clear the interval
        clearInterval(this.state.interval);
    }

    // Handle Return's button
    handleClickHome = () => {
        this.props.history.push("/");
    }

    // Handle Rooms' button
    handleClick = (key) => {

        // Redirect to game page
        // this.props.history.push("/" + this.state.rooms[key]);
        this.props.history.push({ pathname: "/" + this.state.rooms[key] })
    }

    render () {
        const rooms = Object.keys(this.state.rooms).map(key => (
            <CSSTransition timeout={300} classNames='fade' key={key}>
                <button onClick={() => { this.handleClick(key) }}>{key}</button>
            </CSSTransition>
        ))

        return (
            <div className='box' >
                <div className='elements'>
                    <h1>Rooms</h1>
                    <TransitionGroup className='elements' >{rooms}</TransitionGroup>
                    <button className="return" onClick={this.handleClickHome}>Return</button>
                </div>
            </div >
        )
    }
}

export default WithLoginControl(Join)
