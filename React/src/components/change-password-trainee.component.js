import React, { Component } from 'react';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";
import '../css/changePasswordTrainee.css';

export default class ChangePassword extends Component {
    
    constructor(props) {
        super(props);
		
        this.onChangeTraineePassword = this.onChangeTraineePassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            trainee_id:'',
            trainee_email: '',
            trainee_password: '',
            error: true
        }
    }
    
    async componentDidMount() {
        await axios.get('http://localhost:4000/trainee/reset/'+this.props.match.params.token)
            .then(response => {
                    console.log(response);
                    if (response.data.message === 'password reset link a-ok') {
                        this.setState({
                            trainee_id: response.data.trainee_id,
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
        axios.get('http://localhost:4000/trainee/'+this.state.trainee_id)
            .then(response => {
                var trainee_email  = CryptoJS.AES.decrypt(response.data.trainee_email, codes.staff, {iv: codes.iv});
                var trainee_password  = CryptoJS.AES.decrypt(response.data.trainee_password, codes.trainee);
                this.setState({
                    trainee_email: trainee_email.toString(CryptoJS.enc.Utf8),
                    trainee_password: trainee_password.toString(CryptoJS.enc.Utf8),
                })   
            })
            .catch((error) => {
                    console.log(error);
                    this.setState({
                        error: true
                    });
            })
    }
    
    onChangeTraineePassword(e) {
        this.setState({
            trainee_password: e.target.value
        });
    }
	
	onChangeConfirmPassword(e) {
		this.setState({
			confirmPassword: e.target.value,
		});
	}
    
    onSubmit(e) {
        e.preventDefault();
		const {trainee_password, confirmPassword} = this.state;
		if (trainee_password !== confirmPassword){
            alert("Password does not match");
		} 
        else {
            var pass = CryptoJS.AES.encrypt(this.state.trainee_password, codes.trainee);
            const obj = {
                trainee_password: pass.toString()
            };
            console.log(obj);
            axios.post('http://localhost:4000/trainee/update-password/'+this.props.match.params.token, obj)
            .then(res => console.log(res.data));
			this.props.history.push('/login');
            //this.props.history.push('/trainee-details/'+this.state.trainee_id);
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
                               readOnly value={this.state.trainee_email}
                        />
                    </div>
                    <div className="form-group"> 
                        <label>New Password: </label>
                        <input type="password"
                               className="form-control"
                               onChange={this.onChangeTraineePassword}
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