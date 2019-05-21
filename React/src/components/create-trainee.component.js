import React, { Component } from 'react';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import moment from 'moment';

import 'bootstrap/dist/css/bootstrap.css';
import "react-datepicker/dist/react-datepicker.css";
import '@y0c/react-datepicker/assets/styles/calendar.scss';
import '../css/add-trainee.css';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils, {
    formatDate,
  } from 'react-day-picker/moment';

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
        this.onClickBursary = this.onClickBursary.bind(this);

        this.state = {
            trainee_fname: '',
            trainee_lname: '',
            trainee_email: '',
            trainee_password: '',
            trainee_start_date: '',
            trainee_end_date: '',
            currentUser: authService.currentUserValue,
            recruiterEmail: '',
            bursary: 'False'
        }
    }

    componentDidMount(){
        axios.get('http://' + process.env.REACT_APP_AWS_IP + ':4000/admin/staff/' + this.state.currentUser.token._id)
        .then(response => {
          if(response.data == null){
            authService.logout();
            if (!authService.currentUserValue) {
              document.location.href = 'http://' + process.env.REACT_APP_AWS_IP + ':3000/login';
            }
          }
          else{
            var email = CryptoJS.AES.decrypt(response.data.email, codes.staff, { iv: codes.iv }).toString(CryptoJS.enc.Utf8);

            this.setState({
              recruiterEmail: email
            })
          }
        });
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

    onClickBursary(e) {
        if(document.getElementById("bursaryValue").checked){
            this.setState({
                bursary: "True"
            });
        }
        else{
            this.setState({
                bursary: "False"
            });
        }
    }

    onSubmit(e) {
        e.preventDefault();

        if(this.state.trainee_start_date === '' || this.state.trainee_end_date === ''){
            alert('Please select the bursary start/end dates');
        }
        else if(moment(this.state.trainee_end_date).isBefore(this.state.trainee_start_date)){
            alert('The end date is before the start date, please resolve this before creating the trainee');
        }
        else{
            console.log(`Form submitted:`);
            console.log(`Trainee Fname: ${this.state.trainee_fname}`);
            console.log(`Trainee Lname: ${this.state.trainee_lname}`);
            console.log(`Trainee Email: ${this.state.trainee_email}`);
            console.log(this.state.bursary);
            
            var fname = CryptoJS.AES.encrypt(this.state.trainee_fname, codes.trainee);
            var lname = CryptoJS.AES.encrypt(this.state.trainee_lname, codes.trainee);
            var email = CryptoJS.AES.encrypt(this.state.trainee_email, codes.staff, {iv: codes.iv});
            var pass  = CryptoJS.AES.encrypt(Math.random().toString(36).slice(-8), codes.trainee);
            var startDate = CryptoJS.AES.encrypt(this.state.trainee_start_date.toString(), codes.trainee);
            var endDate = CryptoJS.AES.encrypt(this.state.trainee_end_date.toString(), codes.trainee);
            var recruiterEmail = CryptoJS.AES.encrypt(this.state.recruiterEmail, codes.trainee);
            var setStatus = CryptoJS.AES.encrypt('Incomplete', codes.trainee);
            var setBursary = CryptoJS.AES.encrypt(this.state.bursary, codes.trainee);

            var newTrainee = {
                trainee_fname: fname.toString(),
                trainee_lname: lname.toString(),
                trainee_email: email.toString(),
                trainee_password: pass.toString(),
                trainee_start_date: startDate.toString(),
                trainee_end_date: endDate.toString(),
                added_By: recruiterEmail.toString(),
                status: setStatus.toString(),
                bursary: setBursary.toString()
            };

            console.log(newTrainee);
            
            axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/add', newTrainee)
            .then( (response) => {if(response.status == 205){
                                    alert("Email is already in use");
                                }
                                else{
                                    axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/send-email', {
                                        trainee_email: email.toString()
                                        })
                                    .then( (response) => {console.log(response.data);
									                      this.props.history.push('/');
														  window.location.reload();
														 });
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
                        <label> Bursary: </label>
                        <input type="checkbox" id="bursaryValue" onClick={this.onClickBursary}/>
                    </div>

                    <div className="form-group" >
                        <label> Bursary Start Date</label>
                        <div style={{height: '50px'}}>
                        <DayPickerInput
                            placeholder="DD/MM/YYYY"
                            format="DD/MM/YYYY"
                            formatDate={formatDate}
                            value={this.state.trainee_start_date}
                            onDayChange={this.onChangeStartDate}
                            dayPickerProps={{
                                selectedDays: this.state.trainee_start_date,
                                disabledDays: {
                                daysOfWeek: [0, 6],
                                },
                            }} 
                        />
                        </div>
                        <label> Bursary End Date </label>
                        <div style={{height: '50px'}}>
                            <DayPickerInput
                                placeholder="DD/MM/YYYY"
                                format="DD/MM/YYYY"
                                formatDate={formatDate}
                                value={this.state.trainee_end_date}
                                onDayChange={this.onChangeEndDate}
                                dayPickerProps={{
                                    selectedDays: this.state.trainee_end_date,
                                    disabledDays: {
                                    daysOfWeek: [0, 6],
                                    },
                                }}
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