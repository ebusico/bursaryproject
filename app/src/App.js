import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          </header>
          <h1 className="App-database">{this.state.data}</h1>
          
      </div>
    );
  }
}

export default App;
