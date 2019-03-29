import React, { Component } from 'react';
import logo from './QA.png';
import './App.css';
import Nav from './Nav.js';
import CardExample from './Card.js'

class App extends Component {
  state = { 
    data: null
  };
  
  componentDidMount(){
    // Fetch call function once the component mount occurs
    this.callBackendAPI()
    .then(res => this.setState({ data: res.string }))
    .catch(err => console.log(err));
  }

  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !==200){
      throw Error(body.message)
    }
    return body;

  };

  render() {
    return (
      <div className="Card">
        <Nav/>
        <CardExample title={this.state.data} subtitle="Sample"/>
      </div>
    );
  }
}

export default App;
