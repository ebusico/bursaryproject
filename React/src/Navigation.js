import React from 'react';
import logo from './logo.svg';

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
import CryptoJS from "react-native-crypto-js";
import { codes } from "./secrets/secrets.js";
import './css/navigation.css';
import SideBar from './components/sideBar.js';

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
      staff_email: '',
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
      axios.get('http://' + process.env.REACT_APP_AWS_IP + ':4000/trainee/' + this.state.currentUser.token._id)
        .then(response => {
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
                  var email = CryptoJS.AES.decrypt(response.data.email, codes.staff, { iv: codes.iv }).toString(CryptoJS.enc.Utf8);

                  this.setState({
                    staff_email: email
                  })
                }
              })
          } else {
            var trainee_fname = CryptoJS.AES.decrypt(response.data.trainee_fname, codes.trainee).toString(CryptoJS.enc.Utf8);
            var trainee_lname = CryptoJS.AES.decrypt(response.data.trainee_lname, codes.trainee).toString(CryptoJS.enc.Utf8);
            this.setState({
              trainee_fname: trainee_fname,
              trainee_lname: trainee_lname
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
	  	<SideBar pageWrapId={"navigation-bar"} outerContainerId={"bar"} />
		<div id="navigation-bar">
          <Navbar color="light" light expand="md">
            <NavbarBrand href="/login"><img src={logo} alt="QA logo" width="60px" /></NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem className="display_name">Logged in as: {this.state.trainee_fname} {this.state.trainee_lname} {this.state.staff_email}  |  </NavItem>
                <NavItem>
                  <Button onClick={this.logout} href='/login'>
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
                <Button onClick={this.login} href='/login'>
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