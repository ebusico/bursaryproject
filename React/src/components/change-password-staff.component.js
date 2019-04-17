import React, { Component } from 'react';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";
import '../css/changePasswordTrainee.css';

export default class ChangePasswordStaff extends Component {
    
    constructor(props) {
        super(props);
		
        this.onChangeUserPassword = this.onChangeUserPassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            id:'',
            email: '',
            password: '',
            error: true
        }
    }
    
    async componentDidMount() {
        await axios.get('http://localhost:4000/admin/reset-staff/'+this.props.match.params.token)
            .then(response => {
                    console.log(response.data.message);
                    if (response.data.message === 'password reset link a-ok') {
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
        axios.get('http://localhost:4000/admin/staff/'+this.state.id)
            .then(response => {
                var email  = CryptoJS.AES.decrypt(response.data.email, codes.staff, {iv: codes.iv});
                var password  = CryptoJS.AES.decrypt(response.data.password, codes.staffPass);
                this.setState({
                    email: email.toString(CryptoJS.enc.Utf8),
                    password: password.toString(CryptoJS.enc.Utf8),
                })   
            })
            .catch((error) => {
                    console.log(error);
                    this.setState({
                        error: true
                    });
            })
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
            var pass = CryptoJS.AES.encrypt(this.state.password, codes.staffPass);
            const obj = {
                password: pass.toString()
            };
            console.log(obj);
            axios.post('http://localhost:4000/admin/update-password-staff/'+this.props.match.params.token, obj)
            .then(res => console.log(res.data));
        
            this.props.history.push('/');
       }
    }
    
    render() {
        
        const {password, error} = this.state;
        if (error) {
            return (
                <div>
                    <h3>Problem resetting password. Link is invalid or expired</h3>

                </div>
            );
        }
        return (
            <div className="changePassword">
                <form className="changeForm" onSubmit={this.onSubmit}>
                    <h3 align="center">Update Password</h3>
                    <div className="form-group">
                        <label>Email: </label>
                        <input type="text" 
                               className="form-control"
                               readOnly value={this.state.email}
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
                        <input type="submit" value="Update Password" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )

  }
}