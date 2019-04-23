import React, { Component } from 'react';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import DatePicker from 'react-datepicker';
import 'bootstrap/dist/css/bootstrap.css';
import "react-datepicker/dist/react-datepicker.css";
import '@y0c/react-datepicker/assets/styles/calendar.scss';
import '../css/add-trainee.css';


export default class CreateTrainee extends Component {
    
    constructor(props) {
        super(props);
        
        this.onChangeTraineeFname = this.onChangeTraineeFname.bind(this);
        this.onChangeTraineeLname = this.onChangeTraineeLname.bind(this);
        this.onChangeTraineeEmail = this.onChangeTraineeEmail.bind(this);
        this.onChangeTraineePassword = this.onChangeTraineePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeStartDate = this.onChangeStartDate.bind(this);
        this.onChangeEndDate = this.onChangeEndDate.bind(this);

        this.state = {
            trainee_fname: '',
            trainee_lname: '',
            trainee_email: '',
            trainee_password: '',
            trainee_start_date: '',
            trainee_end_date: '',
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

    onChangeStartDate = (startDate) =>{
        this.setState({
            trainee_start_date: startDate
        })

        console.log(startDate);
        console.log(this.state.trainee_start_date);
    }

    onChangeEndDate = (endDate) =>{
        this.setState({
            trainee_end_date: endDate
        })
        console.log(this.state.endDate);
    }
    
    onSubmit(e) {
        e.preventDefault();

        if(this.state.trainee_start_date == '' || this.state.trainee_end_date == ''){
            alert('Please select the bursary start/end dates');
        }
        else{
            console.log(`Form submitted:`);
            console.log(`Trainee Fname: ${this.state.trainee_fname}`);
            console.log(`Trainee Lname: ${this.state.trainee_lname}`);
            console.log(`Trainee Email: ${this.state.trainee_email}`);
            
            var fname = CryptoJS.AES.encrypt(this.state.trainee_fname, codes.trainee);
            var lname = CryptoJS.AES.encrypt(this.state.trainee_lname, codes.trainee);
            var email = CryptoJS.AES.encrypt(this.state.trainee_email, codes.staff, {iv: codes.iv});
            var pass  = CryptoJS.AES.encrypt(Math.random().toString(36).slice(-8), codes.trainee);
            var startDate = CryptoJS.AES.encrypt(this.state.trainee_start_date.toString(), codes.trainee);
            var endDate = CryptoJS.AES.encrypt(this.state.trainee_end_date.toString(), codes.trainee);

            var newTrainee = {
                trainee_fname: fname.toString(),
                trainee_lname: lname.toString(),
                trainee_email: email.toString(),
                trainee_password: pass.toString(),
                trainee_start_date: startDate.toString(),
                trainee_end_date: endDate.toString()
            };
            
            console.log(newTrainee)
            
            axios.post('http://localhost:4000/trainee/add', newTrainee)
            .then( (response) => {if(response.status == 205){
                                    alert("Email is already in use");
                                }
                                else{
                                    axios.post('http://localhost:4000/trainee/send-email', {
                                        trainee_email: email.toString()
                                        })
                                    .then( (response) => console.log(response.data));
                                    this.props.history.push('/');
                                    window.location.reload();
                                }
                    }   
            );  
        }      
    }
    
   render() {
	   if(this.state.currentUser.token.role !== 'recruiter'){
		   return (
		   < AccessDenied />
	   );} else{
        return (
            <div className="createTrainee" style={{marginLeft: 100, marginRight: 100}}>
                <form className="addForm" onSubmit={this.onSubmit}>
                    <h3>Add Trainee</h3>
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
                        <label> Bursary Start Date</label>
                        <div style={{height: '50px'}}>
                            <DatePicker
                                selected={this.state.trainee_start_date}
                                selectsStart
                                startDate={this.state.trainee_start_date}
                                endDate={this.state.trainee_end_date}
                                onChange={this.onChangeStartDate}
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>
                        <label> Bursary End Date </label>
                        <div style={{height: '50px'}}>
                            <DatePicker
                                selected={this.state.trainee_end_date}
                                selectsEnd
                                startDate={this.state.trainee_start_date}
                                endDate={this.state.trainee_end_date}
                                onChange={this.onChangeEndDate}
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>
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