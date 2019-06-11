import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { Component } from 'react';
import './App.css';
import Nav from './Navigation.js'
import { BrowserRouter as Router, Route} from "react-router-dom";

import CreateTrainee from "./components/create-trainee.component";
import EditTrainee from "./components/edit-trainee.component";
import ListTrainee from "./components/list-trainee.component";
import TabFinance from "./components/tab-finance.component";
import SystemLogs from "./components/SystemLogs.component";
import TraineeSettings from "./components/TraineeSettings.component";

import ChangePassword from "./components/change-password-trainee.component";
import TraineeDetails from "./components/trainee-details.component";
import Login from "./components/login.component";
import TabList from "./components/tab-list.component";
import {authService} from "./components/modules/authService";
import AddUser from "./components/create-user.component";
import ChangePasswordStaff from './components/change-password-staff.component';
import EditDates from './components/edit-dates.component';
import { CookieBanner } from '@palmabit/react-cookie-law';
import {codes} from './secrets/secrets';
import ForgotPass from "./components/forgot-password.component";
import UserRecord from "./components/user-history.component";
import Privacy from "./components/priv-notice.component";
import TraineeExpenses from "./components/expenses-trainee.component";
import "./css/Login.css";


class App extends Component {
  render() {
	  if (!authService.currentUserValue){
    return (
       <Router>    
        <div className="App">
          <Nav/>
        </div>
		<Route path="/system_logs" component={Login} />
        <Route path="/admin" component={Login} />
        <Route path="/edit/:id" component={Login} />
        <Route path="/create" component={Login} />
        <Route path="/changePassword/:token" component={ChangePassword} />
        <Route path="/trainee-details/:id" component={Login} />
		<Route path="/login" component={Login} />
        <Route path="/changePasswordStaff/:token" component={ChangePasswordStaff} />
        <Route path="/" exact component={Login} />
		<Route path="/addUser" component={Login} />
    <Route path="/editDates/:id" component={Login} />
    <Route path="/forgotPassword" component={ForgotPass} />
      </Router>    
    );
  }
  else if(authService.currentUserValue.token.role === 'admin'){
    return (
      <Router>    
         <div className="App">
           <Nav/>
         </div>
		 <Route path="/system_logs" component={SystemLogs} />
         <Route path="/admin" component={TabList} />
         <Route path="/edit/:id" component={EditTrainee} />
         <Route path="/create" component={CreateTrainee} />
         <Route path="/changePassword/:token" component={ChangePassword} />
         <Route path="/trainee-details/:id" component={TraineeDetails} />
         <Route path="/login" component={Login} />
         <Route path="/" exact component={TabList} />
         <Route path="/addUser" component={AddUser} />
         <Route path="/changePasswordStaff/:token" component={ChangePasswordStaff} />
         <Route path="/editDates/:id" component={EditDates} />
         <Route path="/history/:id" component={UserRecord} />
         <Route path="/trainee-settings" component={TraineeSettings}/>
         <Route path="/expenses/:id" component={TraineeExpenses} />
         <div data-keyboard="false">
           <Privacy/>
         </div>
       </Router>  
     );
  }else if(authService.currentUserValue.token.role === 'recruiter'){
	  return (
	   <Router>    
        <div className="App">
          <Nav/>
        </div>
		<Route path="/system_logs" component={ListTrainee} />
        <Route path="/admin" component={ListTrainee} />
        <Route path="/edit/:id" component={EditTrainee} />
        <Route path="/create" component={CreateTrainee} />
        <Route path="/changePassword/:token" component={ChangePassword} />
        <Route path="/trainee-details/:id" component={TraineeDetails} />
		    <Route path="/login" component={Login} />
        <Route path="/" exact component={ListTrainee} />
		    <Route path="/addUser" component={AddUser} />
        <Route path="/changePasswordStaff/:token" component={ChangePasswordStaff} />
        <Route path="/editDates/:id" component={EditDates} />
        <div data-keyboard="false">
          <Privacy/>
        </div>
      </Router>  
	  );
  } else{
    return (
      <Router>    
         <div className="App">
           <Nav/>
         </div>
		 <Route path="/system_logs" component={TabList} />
         <Route path="/admin" component={TabList} />
         <Route path="/edit/:id" component={EditTrainee} />
         <Route path="/create" component={CreateTrainee} />
         <Route path="/changePassword/:token" component={ChangePassword} />
         <Route path="/trainee-details/:id" component={TraineeDetails} />
         <Route path="/login" component={Login} />
         <Route path="/" exact component={TabFinance} />
         <Route path="/addUser" component={AddUser} />
         <Route path="/changePasswordStaff/:token" component={ChangePasswordStaff} />
         <Route path="/editDates/:id" component={Login} />
         <div data-keyboard="false">
           <Privacy/>
         </div>
       </Router>  
     );
  }
 }
}

export default App;
