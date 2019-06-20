import React, { Component } from 'react';
import axios from 'axios';
import { codes } from "../secrets/secrets.js";
import '../css/changePasswordTrainee.css';
import { authService } from './modules/authService.js';
// import {authService} from './modules/authService'

export default class PasswordStaff extends Component {
    
    constructor(props) {
        super(props);
		
        this.onChangeUserPassword = this.onChangeUserPassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
        this.onChangeOldPassword = this.onChangeOldPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            id:'',
            email: '',
            password: '',
            oldPassword: '',
            error: true,
            currentUser: authService.currentUserValue
        }
    }
    
    async componentDidMount() {
        await axios.get('https://'+process.env.REACT_APP_AWS_IP+':4000/admin/reset-staff/'+this.props.match.params.token)
            .then(response => {
                    console.log(response.data.message);
                    if (response.data.message === 'password reset link a-ok') {
                        console.log(response.data.staff_id);
                        this.setState({
                            id: response.data.staff_id,
                            error: false
                        })
                    }
            })
            .catch((error) => {
                    console.log(error.response.data);
                    this.setState({
                        error: true
                    });
            })
        axios.get('https://'+process.env.REACT_APP_AWS_IP+':4000/admin/staff/'+this.state.id)
            .then(response => {
                this.setState({
                    email: response.data.email,
                    password: response.data.password
                })   
            })
            .catch((error) => {
                    console.log(error);
                    this.setState({
                        error: true
                    });
            })
    }

    onChangeOldPassword(e){
        this.setState({
            oldPassword: e.target.value
        });
    }
    
    onChangeUserPassword(e) {
        this.setState({
            password: e.target.value
        });
    }
	
	onChangeConfirmPassword(e) {
		this.setState({
			confirmPassword: e.target.value,
		});
	}
    
    onSubmit(e) {
        e.preventDefault();
		const {password, confirmPassword} = this.state;
		if (password !== confirmPassword){
            alert("Password does not match");
		} 
        else {
            const obj = {
                password: this.state.password,
                previous: this.state.oldPassword
            };
            console.log(obj);
            axios.post('https://'+process.env.REACT_APP_AWS_IP+':4000/admin/update-mypassword-staff/'+this.state.currentUser.token._id, obj)
          
            // .then(res => {axios.get('https://'+process.env.REACT_APP_AWS_IP+':4000/admin/removeToken/'+this.props.match.params.token)
            //               console.log(res.data);
            //              })
            .then(res => {console.log(res);
                          
                          this.props.history.push('/');
                         })    
                 
       }
    }
    
    render() {
        
        // const {password, error} = this.state;
        // if (error) {
        //     return (
        //         <div>
        //             <h3>Problem resetting password. Link is invalid or expired</h3>
        //         </div>
        //     );
        // }

        return (
            <div className="changePassword">
                <form className="changeForm" onSubmit={this.onSubmit}>
                    <h3 align="center">Update Password</h3> <br/>
                    {/* <div className="form-group">
                        <label>Email: </label>
                        <input type="text" 
                               className="form-control"
                               readOnly value={this.state.email}
                        />
                    </div> */}
                    
                    <div className="form-group"> 
                        <label>Old Password: </label>
                        <input type="password"
                               className="form-control"
                               onChange={this.onChangeOldPassword}
                        />
                    </div>
                    <div className="form-group"> 
                        <label>New Password: </label>
                        <input type="password"
                               className="form-control"
                               onChange={this.onChangeUserPassword}
                        />
                    </div>
					<div className="form-group">
					   <label>Confirm Password: </label>
					   <input type ="password"
						      className="form-control"
						      onChange={this.onChangeConfirmPassword}
						/>
					</div>
					
                    <br />
                    <div className="form-group">
                        <input id="updatePasswordBtn" type="submit" value="Update Password" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )

  }
}