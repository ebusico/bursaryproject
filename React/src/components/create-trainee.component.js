import React, { Component } from 'react';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';


export default class CreateTrainee extends Component {
    
    constructor(props) {
        super(props);
        
        this.onChangeTraineeFname = this.onChangeTraineeFname.bind(this);
        this.onChangeTraineeLname = this.onChangeTraineeLname.bind(this);
        this.onChangeTraineeEmail = this.onChangeTraineeEmail.bind(this);
        this.onChangeTraineePassword = this.onChangeTraineePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            trainee_fname: '',
            trainee_lname: '',
            trainee_email: '',
            trainee_password: '',
			currentUser: authService.currentUserValue
        }
    }
    
    onChangeTraineeFname(e) {
        this.setState({
            trainee_fname: e.target.value
        });
    }
    
    onChangeTraineeLname(e) {
        this.setState({
            trainee_lname: e.target.value
        });
    }


    onChangeTraineeEmail(e) {
        this.setState({
            trainee_email: e.target.value
        });
    }
    
    onChangeTraineePassword(e) {
        this.setState({
            trainee_password: e.target.value
        });
    }
    
    onSubmit(e) {
        e.preventDefault();
        
        console.log(`Form submitted:`);
        console.log(`Trainee Fname: ${this.state.trainee_fname}`);
        console.log(`Trainee Lname: ${this.state.trainee_lname}`);
        console.log(`Trainee Email: ${this.state.trainee_email}`);
        
        var fname = CryptoJS.AES.encrypt(this.state.trainee_fname, codes.trainee);
        var lname = CryptoJS.AES.encrypt(this.state.trainee_lname, codes.trainee);
        var email = CryptoJS.AES.encrypt(this.state.trainee_email, codes.staff, {iv: codes.iv});
        var pass  = CryptoJS.AES.encrypt(Math.random().toString(36).slice(-8), codes.trainee);

        var newTrainee = {
            trainee_fname: fname.toString(),
            trainee_lname: lname.toString(),
            trainee_email: email.toString(),
            trainee_password: pass.toString()
        };
        
        console.log(newTrainee)
        
        axios.post('http://localhost:4000/trainee/add', newTrainee)
        .then( (response) => {if(response.status == 400){
                                alert("Please fill all forms");
                             }
                             else{
                                axios.post('http://localhost:4000/trainee/send-email', {
									trainee_email: email.toString()
									})
                                .then( (response) => console.log(response.data))
                             }
                }   
        );        
        this.setState({
            trainee_fname: '',
            trainee_lname: '',
            trainee_email: '',
            trainee_password: ''
        })
        
        this.props.history.push('/');
        window.location.reload();
    }
    
   render() {
	   if(this.state.currentUser.token.role !== 'recruiter'){
		   return (
		   < AccessDenied />
	   );} else{
        return (
            <div style={{marginLeft: 100, marginRight: 100}}>
                <h3>Add Trainee</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                        <label>First Name: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.trainee_fname}
                                onChange={this.onChangeTraineeFname}
                                required/>
                    </div>
                    <div className="form-group"> 
                        <label>Last Name: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.trainee_lname}
                                onChange={this.onChangeTraineeLname}
                                required/>
                    </div>
                    <div className="form-group">
                        <label>Email: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.trainee_email}
                                onChange={this.onChangeTraineeEmail}
                                required/>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Add Trainee" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
   }
}