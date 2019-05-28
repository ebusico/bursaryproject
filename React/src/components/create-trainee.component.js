import React, { Component } from 'react';
import axios from 'axios';
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import moment from 'moment';
import momentBusinessDays from 'moment-business-days';
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
        this.onChangeBenchStartDate = this.onChangeBenchStartDate.bind(this);
        this.onChangeBenchEndDate = this.onChangeBenchEndDate.bind(this);
        this.onClickBursary = this.onClickBursary.bind(this);

        this.state = {
            trainee_fname: '',
            trainee_lname: '',
            trainee_email: '',
            trainee_password: '',
            trainee_start_date: '',
            trainee_end_date: '',
			trainee_bench_start_date: '',
			trainee_bench_end_date: '',
            currentUser: authService.currentUserValue,
            recruiterEmail: '',
			trainee_days_worked:'',
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
            this.setState({
              recruiterEmail: response.data.email
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
	
	onChangeBenchStartDate(benchStartDate) {
		this.setState({
			trainee_bench_start_date: benchStartDate,
			trainee_bench_end_date: momentBusinessDays(benchStartDate, 'DD-MM-YYYY').businessAdd(60)._d ,
		})
	}
	// calculate amount of days
	
	onChangeWorkingDays(){
		let currentMonth = moment().format('MM');
		let bursary_start = this.state.trainee_start_date;
		let bursary_end = this.state.trainee_end_date;
		
		if( bursary_start !== moment(bursary_start).endOf("month")){
			this.setState({
				trainee_days_worked:bursary_start.diff(bursary_start, 'days'),
			})
		}
		console.log('Number of days to work: ' + currentMonth);
	}
		
	onChangeBenchEndDate(benchEndDate) {
		this.setState({
			trainee_bench_end_date: benchEndDate
		})	
	}

    onChangeStartDate = (startDate) =>{
        this.setState({
            trainee_start_date: startDate,
			trainee_end_date: momentBusinessDays(startDate, 'DD-MM-YYYY').businessAdd(60)._d ,
			trainee_bench_start_date: momentBusinessDays(startDate, 'DD-MM-YYYY').businessAdd(61)._d ,
			trainee_bench_end_date: momentBusinessDays(startDate, 'DD-MM-YYYY').businessAdd(121)._d ,
        })
        console.log(startDate);
        console.log(this.state.trainee_start_date);
    }

    onChangeEndDate = (endDate) =>{
        this.setState({
            trainee_end_date: endDate,
			trainee_bench_start_date: momentBusinessDays(endDate, 'DD-MM-YYYY').businessAdd(61)._d,
			trainee_bench_end_date: momentBusinessDays(endDate, 'DD-MM-YYYY').businessAdd(121)._d ,

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
		let currentMonth = moment().format('MM-YY');
		let bursary_start = moment(this.state.trainee_start_date).format('MM-YY');
		let bursary_end = moment(this.state.trainee_end_date).format('MM-YY');
		
		if(bursary_start > currentMonth){
			this.setState({
				trainee_days_worked: 0,
			})
		}
		else if(bursary_end < currentMonth){
			this.setState({
				trainee_days_worked: 0,
			})
		}		
		else if( bursary_start === currentMonth){
			let start = moment(this.state.trainee_start_date, 'YYYY-MM-DD'); //Pick any format
			let end = moment(this.state.trainee_start_date, 'YYYY-MM-DD').endOf('month'); //right now (or define an end date yourself)
			let workedDays = moment(start).businessDiff(end);
			console.log('days worked: ' + workedDays);
			
			this.setState({
				trainee_days_worked: workedDays,
			})
		}else if(bursary_end == currentMonth){
			let start = moment(this.state.trainee_end_date, 'YYYY-MM-DD').startOf('month');
			let end = moment(this.state.trainee_end_date, 'YYYY-MM-DD'); 
			let workedDays = 1 + moment(start).businessDiff(end);
			
			console.log('working days for trainee ' + workedDays);
			this.setState({
				trainee_days_worked: workedDays,
			})
		}else{
			let start = moment('YYYY-MM-DD').startOf('month');
			let end = moment('YYYY-MM-DD').endOf('month');
			console.log(start);
			console.log(end)
			console.log(moment(start).businessDiff(end));
		}
		
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
            console.log("this is the start date of state : "+this.state.trainee_start_date);
            var newTrainee = {
                trainee_fname: this.state.trainee_fname,
                trainee_lname: this.state.trainee_lname,
                trainee_email: this.state.trainee_email,
                trainee_password: Math.random().toString(36).slice(-8),
                trainee_start_date: this.state.trainee_start_date.toString(),
                trainee_end_date: this.state.trainee_end_date.toString(),
                added_By: this.state.recruiterEmail,
                status: 'Incomplete',
                bursary: this.state.bursary,
				trainee_bench_end_date: this.state.trainee_bench_end_date,
				trainee_bench_start_date: this.state.trainee_bench_start_date,
            };
            console.log("this is the start date of the variable : "+ newTrainee.trainee_start_date);

            console.log(newTrainee);
            
            axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/add', newTrainee)
            .then( (response) => {if(response.status == 205){
                                    alert("Email is already in use");
                                }
                                else{

                                    axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/send-email', {
                                        trainee_email: this.state.trainee_email.toLowerCase()
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
	   if(this.state.currentUser.token.role !== 'recruiter' && this.state.currentUser.token.role !== 'admin'){
		   return (
		   < AccessDenied />
	   );} else{
        return (
            <div className="createTrainee" style={{marginLeft: 200, marginRight: 200}}>
                <form className="createTraineeForm" onSubmit={this.onSubmit}>
                    <h3 className="title">Add Trainee</h3>
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
								month:this.trainee_start_date,
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
									month:this.state.trainee_end_date,
                                    selectedDays: this.state.trainee_end_date,
                                    disabledDays: {
                                    daysOfWeek: [0, 6],
                                    },
                                }}
                            />
                        </div>
						<label> Bench Start Date </label>
						<div style={{height: '50px'}}>
                            <DayPickerInput
                                placeholder="DD/MM/YYYY"
                                format="DD/MM/YYYY"
                                formatDate={formatDate}
                                value={this.state.trainee_bench_start_date}
                                onDayChange={this.onChangeBenchStartDate}
                                dayPickerProps={{
									month:this.state.trainee_bench_start_date,
                                    selectedDays: this.state.trainee_bench_start_date,
                                    disabledDays: {
                                    daysOfWeek: [0, 6],
                                    },
                                }}
                            />
                        </div>
						<label> Bench End Date </label>
						<div style={{height: '50px'}}>
                            <DayPickerInput
                                placeholder="DD/MM/YYYY"
                                format="DD/MM/YYYY"
                                formatDate={formatDate}
                                value={this.state.trainee_bench_end_date}
                                onDayChange={this.onChangeBenchEndDate}
                                dayPickerProps={{
									month:this.state.trainee_bench_end_date,
                                    selectedDays: this.state.trainee_bench_end_date,
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