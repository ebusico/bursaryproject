import React, { Component } from 'react';
import axios from 'axios';

export default class EditTrainee extends Component {
    
    constructor(props) {
        super(props);
		
        this.onChangeTraineePassword = this.onChangeTraineePassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            trainee_email: '',
            trainee_password: ''
        }
    }
    
    componentDidMount() {
        axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/'+this.props.match.params.id)
            .then(response => {
                this.setState({
                    trainee_email: response.data.trainee_email,
                    trainee_password: response.data.trainee_password,
                })   
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    
    onChangeTraineePassword(e) {
        this.setState({
            trainee_password: e.target.value,
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
		} else {
        const obj = {
            trainee_password: this.state.trainee_password
        };
        console.log(obj);
        axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/update-password/'+this.props.match.params.id, obj)
            .then(res => console.log(res.data));
        
        this.props.history.push('/trainee-details/'+this.props.match.params.id);
    }
}
    render() {
        return (
            <div>
                <h3 align="center">Update Password</h3>
                <form onSubmit={this.onSubmit}>
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