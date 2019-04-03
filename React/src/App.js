import React, { Component } from 'react';
import './App.css';
import Nav from './Nav.js'
import { BrowserRouter as Router, Route} from "react-router-dom";

import CreateTrainee from "./components/create-trainee.component";
import EditTrainee from "./components/edit-trainee.component";
import ListTrainee from "./components/list-trainee.component";
import Login from "./components/login.component"

import ChangePassword from "./components/change-password-trainee.component";

class App extends Component {
  render() {
    return (
      <Router>    
        <div className="App">
          <Nav/>
          <h2>QA Bursary</h2>
        </div>
        <Route path="/" exact component={ListTrainee} />
        <Route path="/edit/:id" component={EditTrainee} />
        <Route path="/create" component={CreateTrainee} />
        <Route path="/login" component={Login} />
		<Route path="/changePassword/:id" component={ChangePassword} />
      </Router>    
    );
  }
}

export default App;
