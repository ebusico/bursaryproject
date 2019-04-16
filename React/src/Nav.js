import React from 'react';
import logo from './logo.svg';
import { Redirect } from 'react-router-dom'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { authService } from "./components/modules/authService";

export default class Example extends React.Component {
  constructor(props) {
    super(props);
	
	this.logout = this.logout.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  logout(){
	  authService.logout();
	  if (!authService.currentUserValue){
		document.location.href = 'http://localhost:3000/login';
		} 

  }
  render() {
    if (authService.currentUserValue){
    return (
      <div>
        <Navbar color="light" light expand="md">
		<NavbarBrand href="/"><img src={logo} alt="QA logo" width="60px" /></NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
			  <NavLink>
				<NavItem onClick={this.logout} href='/login'>Logout</NavItem>
				</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
	  }else if(!authService.currentUserValue){
		  return (
      <div>
        <Navbar color="light" light expand="md">
		<NavbarBrand href="/"><img src={logo} width="60px" /></NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavItem onClick={this.login} href='/login' >Login</NavItem>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
		  
	  }
  }
}