import React, { Component } from 'react';
import axios from 'axios';

export default class EditTrainee extends Component {
    
    constructor(props) {
        super(props);
		
        this.onChangeTraineeEmail = this.onChangeTraineeEmail.bind(this);
        this.onChangeTraineePassword = this.onChangeTraineePassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
			trainee_fname: '',
            trainee_lname: '',
            trainee_email: '',
            trainee_password: '',
			confirmPassword: '',
        }
    }
    
    componentDidMount() {
        axios.get('http://localhost:4000/trainee/'+this.props.match.params.id)
            .then(response => {
                this.setState({
                    trainee_fname: response.data.trainee_fname,
                    trainee_lname: response.data.trainee_lname,
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

    onChangeTraineeEmail(e) {
        this.setState({
            trainee_email: e.target.value,
        });
    }
    
    onSubmit(e) {
        e.preventDefault();
		const {trainee_password, confirmPassword} = this.state;
		if (trainee_password !== confirmPassword){
			alert("Password does not match");
		} else {
        const obj = {
			trainee_fname: this.state.trainee_fname,
            trainee_lname: this.state.trainee_lname,
            trainee_email: this.state.trainee_email,
            trainee_password: this.state.trainee_password,
        };
        console.log(obj);
        axios.post('http://localhost:4000/trainee/update/'+this.props.match.params.id, obj)
            .then(res => console.log(res.data));
        
        this.props.history.push('/');
    }
}
    render() {
        return (
            <div>
                <h3 align="center">Update Password</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Email: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.trainee_email}
                                onChange={this.onChangeTraineeEmail}
                                />
                    </div>
                    <div className="form-group"> 
                        <label>Password: </label>
                        <input  type="password"
                                className="form-control"
                                value={this.state.trainee_password}
                                onChange={this.onChangeTraineePassword}
                                />
                    </div>
					<div className="form-group">
					<label>Confirm Password: </label>
					<input type ="password"
						className="form-control"
						value={this.state.confirmPassword}
						onChange={this.onChangeConfirmPassword}
						/>
					</div>
					
                    <br />
                    <div className="form-group">
                        <input type="submit" value="Update Trainee" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}