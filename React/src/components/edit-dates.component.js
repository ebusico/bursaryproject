import React, { Component } from 'react';
import axios from 'axios';
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import '../css/edit-list-trainee.css';
import "react-datepicker/dist/react-datepicker.css";
import momentBusinessDays from 'moment-business-days';
import moment from 'moment';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import {
    formatDate,
  } from 'react-day-picker/moment';

export default class EditDates extends Component {
    
    constructor(props) {
        super(props);
        
        this.onChangeTraineeFname = this.onChangeTraineeFname.bind(this);
        this.onChangeTraineeLname = this.onChangeTraineeLname.bind(this);
        this.onChangeTraineeEmail = this.onChangeTraineeEmail.bind(this);
        this.onChangeStartDate = this.onChangeStartDate.bind(this);
        this.onChangeEndDate = this.onChangeEndDate.bind(this);
		this.onChangeBenchStartDate = this.onChangeBenchStartDate.bind(this);
        this.onChangeBenchEndDate = this.onChangeBenchEndDate.bind(this);
		this.onChangeWorkingDays = this.onChangeWorkingDays.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            trainee_fname: '',
            trainee_lname: '',
            trainee_email: '',
            trainee_start_date: '',
            trainee_end_date: '',
			trainee_bench_start_date: '',
			trainee_bench_end_date: '',
			trainee_days_worked: '',
			currentUser: authService.currentUserValue
        }
    }
	
	//Working day
	onChangeWorkingDays(e) {
		let currentMonth = moment().format('MM');
		let bursary_start = moment(this.state.trainee_start_date).format('MM');
		let bursary_end = moment(this.state.trainee_end_date).format('MM');
		let start = moment(this.state.trainee_start_date, 'YYYY-MM-DD'); //Pick any format
		let end = moment(this.state.trainee_start_date, 'YYYY-MM-DD').endOf('month'); //right now (or define an end date yourself)
		let weekdayCounter = 0;
		console.log(end);
		console.log(start);
		while (start <= end) {
			if (start.format('ddd') !== 'Sat' && start.format('ddd') !== 'Sun'){
				weekdayCounter++; //add 1 to your counter if its not a weekend day
			}
			start = moment(start, 'YYYY-MM-DD').add(1, 'days'); //increment by one day
		}
		console.log(weekdayCounter); //display your total elapsed weekdays in the console!
		console.log('Number of days to work: ' + currentMonth);
		console.log('start '+ bursary_start);
	}
	
	onChangeBenchStartDate(benchStartDate) {
		this.setState({
			trainee_bench_start_date: benchStartDate,
			trainee_bench_end_date: momentBusinessDays(benchStartDate, 'DD-MM-YYYY').businessAdd(60)._d ,
		})
	}
	
	onChangeBenchEndDate(benchEndDate) {
		this.setState({
			trainee_bench_end_date: benchEndDate
		})	
	}

    onChangeStartDate = (startDate) =>{
        this.setState({
            trainee_start_date: startDate,
			trainee_end_date: momentBusinessDays(startDate, 'DD-MM-YYYY').businessAdd(60)._d 
        })
        console.log(startDate);
        console.log(this.state.trainee_start_date);
    }

     onChangeEndDate = (endDate) =>{
        this.setState({
            trainee_end_date: endDate,
			trainee_bench_start_date: momentBusinessDays(endDate, 'DD-MM-YYYY').businessAdd(1)._d
        })
    }
	
	//gets all days based within start and end date
	
    /*calculateDaysLeft(trainee_start_date, trainee_end_date){
		if(!moment.isMoment(trainee_start_date)) trainee_start_date = moment(trainee_start_date);
		if(!moment.isMoment(trainee_end_date)) trainee_end_date = moment(trainee_end_date);
		return trainee_end_date.diff(trainee_start_date, "days");
	}
	*/
    componentDidMount() {
        axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/'+this.props.match.params.id)
            .then(response => {
                console.log(response);
                
                this.setState({
                    trainee_fname: response.data.trainee_fname,
                    trainee_lname: response.data.trainee_lname,
                    trainee_email: response.data.trainee_email,
                    trainee_start_date: new Date (response.data.trainee_start_date),
                    trainee_end_date: new Date (response.data.trainee_end_date),
					trainee_bench_start_date: new Date (response.data.trainee_bench_start_date),
					trainee_bench_end_date: new Date(response.data.trainee_bench_end_date),
                })
                console.log(this.state.trainee_start_date);
                console.log(this.state.trainee_end_date);
                console.log(this.state.trainee_bench_start_date);
                console.log(this.state.trainee_bench_end_date);   
            })
            .catch(function (error) {
                console.log(error);
            })
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
    
    onSubmit(e) {
		if(this.state.trainee_start_date === '' || this.state.trainee_end_date === ''){
            alert('Please select the bursary start/end dates');
        }
        else if(moment(this.state.trainee_end_date).isBefore(this.state.trainee_start_date)){
            alert('The end date is before the start date, please resolve this before creating the trainee');
        }
		else if(this.state.trainee_bench_start_date === '' || this.state.trainee_bench_end_date === ''){
			alert('Please Enter the trainee bench start/end dates');
		}
		else if (moment(this.state.trainee_bench_end_date).isBefore(this.state.trainee_bench_start_date)){
			alert('The end date is before the start date, please resolve this before finish editing');
		}
        e.preventDefault();

        const obj = {
            trainee_start_date: this.state.trainee_start_date,
            trainee_end_date: this.state.trainee_end_date,
			trainee_bench_start_date:this.state.trainee_bench_start_date,
			trainee_bench_end_date:this.state.trainee_bench_end_date,
			trainee_days_worked: this.state.trainee_days_worked,
		}
		
        console.log(obj);
        axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/editDates/'+this.props.match.params.id, obj)
            .then(res => {console.log(res.data);
                          this.props.history.push('/');
                          window.location.reload();});    
    }


    render() {
		if(this.state.currentUser.token.role === 'admin' || this.state.currentUser.token.role === 'recruiter'){
        return (
            <div className="QATable">
                <form className="edit-form" onSubmit={this.onSubmit}>
                    <div className="all-edit-box">
					<div className="form-group"> 
                        <label>First Name: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.trainee_fname}
                                onChange={this.onChangeTraineeFname}
                                disabled
                                />
                    </div>
                     <div className="form-group"> 
                        <label>Last Name: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.trainee_lname}
                                onChange={this.onChangeTraineeLname}
                                disabled
                                />
                    </div>           
                    <div className="form-group">
                        <label>Email: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.trainee_email}
                                onChange={this.onChangeTraineeEmail}
                                disabled
                                />
                    </div>
                    <div id="bursaryDates">
                    <label> Bursary Start Date : </label>
                    <br></br>
                        <DayPickerInput
                            value={this.state.trainee_start_date}
                            format="DD/MM/YYYY"
                            formatDate={formatDate}
                            onDayChange={this.onChangeStartDate}
                            dayPickerProps={{
								month:this.state.trainee_start_date,
                                selectedDays: this.state.trainee_start_date,
                                disabledDays: {
                                daysOfWeek: [0, 6],
                                },
                            }}
                        />
                    </div>
                    <div id="bursaryDates">
                        <label> Bursary End Date : </label>
                        <br></br>
                            <DayPickerInput
                                value={this.state.trainee_end_date}
                                format="DD/MM/YYYY"
                                formatDate={formatDate}
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
					 <div id="bursaryDates">
                        <label> Bench start Date : </label>
                        <br></br>
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
					<div id="bursaryDates">
                        <label> Bench End Date : </label>
                        <br></br>
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
					<div className="form-group">
                        <label>Amount of days to be paid bursary</label>
                        <input 
                                type="number" 
								max="31"
                                className="form-control"
                                value={this.state.trainee_days_worked}
                                onChange={this.onChangeWorkingDays}
								required/>
                    </div>
                    <br />
                    <div className="form-group">
                        <input type="submit" value="Update" className="btn btn-primary" />
                    </div>
					</div>
				</form>
            </div>
        )
    }
    else {
        return (
        <AccessDenied/>
    );
    }
  }
}