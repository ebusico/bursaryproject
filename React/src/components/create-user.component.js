import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import '../css/add-user.css';

export default class CreateUser extends Component {
    
    constructor(props) {
        super(props);
        this.onChangeUserEmail = this.onChangeUserEmail.bind(this);
        this.onChangeUserPassword = this.onChangeUserPassword.bind(this);
        this.changeUserFName = this.onChangeUserFName.bind(this);
        this.changeUserLName = this.onChangeUserLName.bind(this);
        this.changeUserRole = this.changeUserRole.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = {
            user_email: '',
            user_fname: ' ',
            user_lname: ' ',
            user_password: '',
            user_role: 'Role',
            dropdownOpen: false,
			currentUser: authService.currentUserValue
        }
    }

    toggle() {
        this.setState(prevState => ({
          dropdownOpen: !prevState.dropdownOpen
        }));
      }

    onChangeUserEmail(e) {
        this.setState({
            user_email: e.target.value
        });
    }

    onChangeUserFName(e) {
        this.setState({
            user_fname: e.target.value
        });
    }

    onChangeUserLName(e) {
        this.setState({
            user_lname: e.target.value
        });
    }
    
    onChangeUserPassword(e) {
        this.setState({
            user_password: e.target.value
        });
    }

    changeUserRole(e) {
        this.setState({
            user_role: e.currentTarget.textContent
        });
    }

    // Function to transform names to only having first letter of each word capitalised
    toTitleCase(phrase) {
        return phrase
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    };
    
    onSubmit(e) {
        e.preventDefault();
        
        console.log(`Form submitted:`);
        console.log(`User Email: ${this.state.user_email}`);
        console.log(`User role: ${this.state.user_role}`)
        
        // var setStatus = "Active";

        var newUser = {
            email: this.state.user_email.toLowerCase(),
            fname: this.toTitleCase(this.state.user_fname),
            lname: this.toTitleCase(this.state.user_lname),
            password: Math.random().toString(36).slice(-8),
            role: this.state.user_role.toLowerCase(),
            status: 'Pending'
        };
        
        console.log(newUser)

        if(newUser.role === "role"){
            alert("You must select a role")
        }
        else{
            axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/admin/addUser', newUser)
            .then( (response) => {console.log(response);
                                if(response.status === 205){
                                    console.log("dupe email");
                                    alert("Email already in use");
                                 }
                                 else{
                                    console.log("else");
                                    axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/admin/send-email-staff', {email: this.state.user_email})
                                    .then( (response) => {console.log(response.data)
									                      this.props.history.push('/admin');
														  window.location.reload();
														 });
                                 }
            })
        }
    }
    
   render() {
	   if(this.state.currentUser.token.role !=='admin'){
	   return (
	   <AccessDenied/>
	   );
	  }else{
        return (
            <div className="createUser" style={{marginLeft: 100, marginRight: 100}}>
                
                <form className="addForm" onSubmit={this.onSubmit}>
                    <h3>Add User <center><button id="cancelBtn" onClick={() => { document.location.href = "/"; }}> ⭠ Back</button></center></h3>
                    <div className="form-group">
                        <div className="user-text-inputs">
                            <label>First Name: </label>
                            <input 
                                type="text"
                                className="form-control"
                                value={this.state.user_fname}
                                onChange={this.changeUserFName}
                                required/>
                            <br/>
                            <label>Last Name: </label>
                            <input 
                                type="text"
                                className="form-control"
                                value={this.state.user_lname}
                                onChange={this.changeUserLName}
                                required/>
                            <br/>
                            <label>Email: </label>
                            <input 
                                    type="email" 
                                    className="form-control"
                                    value={this.state.user_email}
                                    onChange={this.onChangeUserEmail}
                                    required/>
                        </div>
                        <br></br>
                        <Dropdown id="dropDown" isOpen={this.state.dropdownOpen} toggle={this.toggle} required>
                        <DropdownToggle caret>
                        {this.state.user_role}
                        </DropdownToggle>
                        <DropdownMenu>
                        <DropdownItem onClick={this.changeUserRole}>
                                Recruiter
                        </DropdownItem>
                        <DropdownItem onClick={this.changeUserRole}>
                                Finance
                        </DropdownItem>
                        <DropdownItem onClick={this.changeUserRole}>
                                Admin
                        </DropdownItem>
                        </DropdownMenu>
                        </Dropdown>
                    <br></br>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Add User" id="updateBtn" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
   }
}