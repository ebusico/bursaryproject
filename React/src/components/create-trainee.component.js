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
import Collapse from 'react-bootstrap/Collapse'
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
        this.onChangeBursaryAmount = this.onChangeBursaryAmount.bind(this);

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
            recruiterName: '',
			trainee_days_worked:'',
            bursary: 'False',
            bursary_amount: 0,
            open: false,
            default_bursary: 0,
            bankHolidays: true
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
            console.log(response.data);
            this.setState({
              recruiterName: response.data.fname + ' ' + response.data.lname 
            })
            axios.get('http://' + process.env.REACT_APP_AWS_IP + ':4000/settings/').then(response =>{
                console.log(response.data);
                this.setState({
                            bankHolidays: response.data.pay_bank_holidays,
                            default_bursary: response.data.default_bursary});
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
			trainee_bench_end_date: momentBusinessDays(benchStartDate, 'DD-MM-YYYY').businessAdd(59)._d ,
		})
	}
		
	onChangeBenchEndDate(benchEndDate) {
		this.setState({
			trainee_bench_end_date: benchEndDate
		})	
		console.log(this.state.bankHolidays);
	}

    onChangeStartDate = (startDate) =>{
        this.setState({
            trainee_start_date: startDate,
			trainee_end_date: momentBusinessDays(startDate, 'DD-MM-YYYY').businessAdd(59)._d ,
			trainee_bench_start_date: momentBusinessDays(startDate, 'DD-MM-YYYY').businessAdd(60)._d ,
			trainee_bench_end_date: momentBusinessDays(startDate, 'DD-MM-YYYY').businessAdd(119)._d ,
        })
        console.log(startDate);
        console.log(this.state.trainee_start_date);
    }

    onChangeEndDate = (endDate) =>{
        this.setState({
            trainee_end_date: endDate,
			trainee_bench_start_date: momentBusinessDays(endDate, 'DD-MM-YYYY').businessAdd(1)._d,
			trainee_bench_end_date: momentBusinessDays(endDate, 'DD-MM-YYYY').businessAdd(60)._d ,

	   })
        console.log(this.state.endDate);
    }

    onClickBursary(e) {
        if(this.state.bursary==="False"){
            this.setState({
                bursary: "True",
                bursary_amount: this.state.default_bursary,
                open: true
            });
        }
        else{
            this.setState({
                bursary: "False",
                bursary_amount: 0,
                open: false
            });
        }
    }

    onChangeBursaryAmount(e){
        this.setState({
            bursary_amount: e.target.value
        })
    }

    // Function to transform names to only having first letter of each word capitalised
    toTitleCase(phrase) {
        return phrase
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    };
	
    onSubmit(e) {
        e.preventDefault();

        var alertDeterminer;
        
        if(this.state.trainee_start_date === '' || this.state.trainee_end_date === ''){
            alertDeterminer = "blankdates";
        }
        else if(moment(this.state.trainee_end_date).isBefore(this.state.trainee_start_date)){
            alertDeterminer = "dateswrongorder";
        }
        else if(moment(this.state.trainee_end_date).diff(this.state.trainee_start_date, 'days') < 14 || moment(this.state.trainee_end_date).diff(this.state.trainee_start_date, 'days') > 84 ){
            alertDeterminer = "tooloworhigh";
        }
        else if(this.state.bursary_amount > 100){
            alertDeterminer = "toomuchbursary"
        }

        switch (alertDeterminer){
            case "blankdates":
                alert('Please select the bursary start/end dates');
                break;
            case "dateswrongorder":
                alert('The end date is before the start date, please resolve this before creating the trainee');
                break;
            case "tooloworhigh":
                var dateWarning = window.confirm("The dates you have entered are unusually high or low. Are you sure you want to proceed?");
                
				if (dateWarning == false){
                break;
                }
            case "toomuchbursary":
                var dateWarning = window.confirm("Are you sure you want to give this trainee a bursary of more than £100 daily?");
    
                if(dateWarning == false){
                    break;
                }
            default:
            console.log(`Form submitted:`);
            console.log(`Trainee Fname: ${this.state.trainee_fname}`);
            console.log(`Trainee Lname: ${this.state.trainee_lname}`);
            console.log(`Trainee Email: ${this.state.trainee_email}`);
            console.log(this.state.bursary);
            console.log("this is the start date of state : "+this.state.trainee_start_date);
            var newTrainee = {
                trainee_fname: this.toTitleCase(this.state.trainee_fname),
                trainee_lname: this.toTitleCase(this.state.trainee_lname),
                trainee_email: this.state.trainee_email,
                trainee_password: Math.random().toString(36).slice(-8),
                trainee_start_date: this.state.trainee_start_date.toString(),
                trainee_end_date: this.state.trainee_end_date.toString(),
                added_By: this.state.recruiterName,
                status: 'Pending',
                bursary: this.state.bursary,
                bursary_amount: this.state.bursary_amount.toString(),
				trainee_bench_end_date: this.state.trainee_bench_end_date.toString(),
				trainee_bench_start_date: this.state.trainee_bench_start_date.toString(),
				bank_holiday: this.state.bankHolidays,
				
            };
            console.log("this is the start date of the variable : "+ newTrainee.trainee_start_date);
			console.log(this.state.bank_holidays);
            console.log(newTrainee);
            
            axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/add', newTrainee)
            .then( (response) => {if(response.status == 205){
                                    alert("Email is already in use");
                                }
                                else{
									axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/daysToWork', {
										trainee_email: this.state.trainee_email.toLowerCase()
										})
									.then((response) => {
										console.log(response.data) 
									});

                                    axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/send-email', {
                                        trainee_email: this.state.trainee_email.toLowerCase(),
                                        trainee_fname: this.toTitleCase(this.state.trainee_fname)
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
                    <div><center><button id="cancelBtn" onClick={() => { document.location.href = "/"; }}>Cancel</button></center></div>
                    <div className="text-input-fields">
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
                                    type="email" 
                                    className="form-control"
                                    value={this.state.trainee_email}
                                    onChange={this.onChangeTraineeEmail}
                                    required/>
                        </div>
                    </div>
					
                    <div className="form-group">
                        <label> Bursary: </label>
						&nbsp;&nbsp;
                        <input type="checkbox" id="bursaryValue" onClick={this.onClickBursary}/>
                    </div>

                    <Collapse in={this.state.open}>
                    <div className="form-group">
                        <label>Bursary Amount:</label>
                        <br />
						&nbsp;&nbsp;
                                <input 
                                    type="number"
                                    value={this.state.bursary_amount}
                                    onChange={this.onChangeBursaryAmount}
                                    required/>
                    </div>
                    </Collapse>
				                    
					<div className="form-group" >
                        <label> Training Start Date</label>
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
                        <label> Training End Date </label>
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
                        <input id="createTraineeBtn" type="submit" value="Add Trainee" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
   }
}
