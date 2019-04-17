import React, { Component } from 'react';
import './App.css';
import Nav from './Nav.js'
import { BrowserRouter as Router, Route} from "react-router-dom";

import CreateTrainee from "./components/create-trainee.component";
import EditTrainee from "./components/edit-trainee.component";
import ListTrainee from "./components/list-trainee.component";

import ChangePassword from "./components/change-password-trainee.component";
import TraineeDetails from "./components/trainee-details.component";
import Login from "./components/login.component";
import TabList from "./components/tab-list.component";
import {authService} from "./components/modules/authService";
import AddUser from "./components/create-user.component";
import ChangePasswordStaff from './components/change-password-staff.component';


class App extends Component {
  render() {
	  if (!authService.currentUserValue){
    return (
      <Router>    
        <div className="App">
          <Nav/>
          <h2>QA Bursary</h2>
        </div>
		<Route path="/changePassword/:token" component={ChangePassword} />
        <Route path="/changePasswordStaff/:token" component={ChangePasswordStaff} />
        <Route path="/" exact component={Login} />
        <Route path="/login" component={Login} />
      </Router>    
    );
  } else {
	  return (
	   <Router>    
        <div className="App">
          <Nav/>
          <h2>QA Bursary</h2>
        </div>
        <Route path="/admin" component={TabList} />
        <Route path="/edit/:id" component={EditTrainee} />
        <Route path="/create" component={CreateTrainee} />
        <Route path="/changePassword/:token" component={ChangePassword} />
        <Route path="/trainee-details/:id" component={TraineeDetails} />
		<Route path="/login" component={Login} />
        <Route path="/" exact component={ListTrainee} />
		<Route path="/addUser" component={AddUser} />
        <Route path="/changePasswordStaff/:token" component={ChangePasswordStaff} />
      </Router>  
	  );
  }
 }
}

export default App;
