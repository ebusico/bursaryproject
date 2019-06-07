import React, { Component } from 'react';
import axios from 'axios';
import '../css/changePasswordTrainee.css';

export default class ForgotPass extends Component {
    
    constructor(props) {
        super(props);
		
        this.onSubmit = this.onSubmit.bind(this);
		this.onChangeEmail = this.onChangeEmail.bind(this);

        this.state = {
            email: '',
            error: true
        }
    }
    
	onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }
    
    onSubmit(e) {
		e.preventDefault();
		
		axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/getByEmail', {trainee_email: this.state.email})
		.then( (response) => {console.log(response);
                                if(response.data === "") {
                                    axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/admin/getByEmail', {staff_email: this.state.email})
									.then ( (response) => {
										if(response.data == null){
											alert("email not found");
										}
										else{
											axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/admin/send-email-staff', {email: this.state.email})
											.then( (response) => {console.log(response.data);
																  this.props.history.push('/login');
																  window.location.reload();
                                            });
                                        }
									})
                                 }
                                else{
                                    console.log("trainee found")
									axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/send-email', {trainee_email: this.state.email})
									.then( (response) => {console.log(response.data);
														  this.props.history.push('/login');
														  window.location.reload();
										});
                                 }
            })
				 
		} 
		

    
    render() {
        
        return (
            <div className="resetPassword">
                <form className="changeForm" onSubmit={this.onSubmit}>
                    <h3 align="center">Forgot Password</h3>
					<p>Please enter your email address below, a link will be sent to that account to reset your password.</p>
                    <div className="form-group">
                        <label>Email: </label>
                        <input type="text" 
                               className="form-control"
							   value={this.state.email}
                               onChange={this.onChangeEmail}
                        />
                    </div>
                    
                    <br />
                    <div className="form-group">
                        <input id="updatePasswordBtn" type="submit" value="Send Email" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )

  }
}