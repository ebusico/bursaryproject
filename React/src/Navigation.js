import React from 'react';
import logo from './QA_logo.png';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
  NavLink
} from 'reactstrap';
import { authService } from "./components/modules/authService";
import axios from 'axios';
import './css/navigation.css';
import TopNavBar from './components/topNavBar.component.js';

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      currentUser: authService.currentUserValue,
      token: '',
      id: '',
      staff_fname: '',
	  staff_lname: '',
      trainee_fname: '',
      trainee_lname: ''
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  //Display user
  componentDidMount() {
    // if not logged in no name will be displaed
    if (!authService.currentUserValue) {
      return null
    } else {
      console.log("token id is: "+ this.state.currentUser.token._id);
      console.log(this.state.currentUser);
      axios.get('http://' + process.env.REACT_APP_AWS_IP + ':4000/trainee/' + this.state.currentUser.token._id)
        .then(response => {
          console.log(response);
          if (response.data == null) {
            axios.get('http://' + process.env.REACT_APP_AWS_IP + ':4000/admin/staff/' + this.state.currentUser.token._id)
              .then(response => {
                if(response.data == null){
                  authService.logout();
                  if (!authService.currentUserValue) {
                    document.location.href = 'http://' + process.env.REACT_APP_AWS_IP + ':3000/login';
                  }
                }
                else{
                  this.setState({
                    staff_fname: response.data.fname,
					staff_lname: response.data.lname
                  })
                }
              })
          } else {
            this.setState({
              trainee_fname: response.data.trainee_fname,
              trainee_lname: response.data.trainee_lname
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }

  login() {
    document.location.href = 'http://' + process.env.REACT_APP_AWS_IP + ':3000/login';
  }
  logout() {
    authService.logout();
    if (!authService.currentUserValue) {
      document.location.href = 'http://' + process.env.REACT_APP_AWS_IP + ':3000/login';
    }

  }
  render() {

    if (authService.currentUserValue) {
      return (
        <div id='bar'>
		<div id="navigation-bar">
          <Navbar color="light" light expand="md">
            <NavbarBrand href="/login"><img src={logo} alt="QA logo" width="60px" /></NavbarBrand>
                      <NavbarToggler onClick={this.toggle} />
                      <TopNavBar pageWrapId={"navigation-bar"} outerContainerId={"bar"} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem className="display_name">Logged in as: {this.state.trainee_fname} {this.state.trainee_lname} {this.state.staff_fname} {this.state.staff_lname}  |  </NavItem>
                <NavItem>
                  <Button id="logoutBtn" onClick={this.logout} href='/login'>
                    Logout
                  </Button>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
		 </div>
		</div>
      );
    } else if (!authService.currentUserValue) {
      return (
        <div id="navigation-bar">
          <Navbar color="light" light expand="md">
            <NavbarBrand href="/"><img src={logo} width="60px" />
			</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <Button id="loginBtn" onClick={this.login} href='/login'>
                  Login
                </Button>
              </Nav>
            </Collapse> 
          </Navbar>
        </div>
      );

    }
  }
}