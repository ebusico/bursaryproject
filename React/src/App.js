import React, { Component } from 'react';
import './App.css';
import Nav from './Nav.js'
import { BrowserRouter as Router, Route} from "react-router-dom";

import CreateTrainee from "./components/create-trainee.component";
import EditTrainee from "./components/edit-trainee.component";
import ListTrainee from "./components/list-trainee.component";

import ChangePassword from "./components/change-password-trainee.component";
import TraineeDetails from "./components/trainee-details.component";

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
        <Route path="/changePassword/:id" component={ChangePassword} />
        <Route path="/trainee-details/:id" component={TraineeDetails} />
      </Router>    
    );
  }
}

export default App;
