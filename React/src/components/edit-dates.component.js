import React, { Component } from 'react';
import axios from 'axios';
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import '../css/edit-list-trainee.css';
import "react-datepicker/dist/react-datepicker.css";
import momentBusinessDays from 'moment-business-days';
import moment from 'moment';
import Collapse from 'react-bootstrap/Collapse'

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
        this.onChangeBursaryAmount = this.onChangeBursaryAmount.bind(this);
        this.onClickBursary = this.onClickBursary.bind(this);
		
        this.state = {
            trainee_fname: '',
            trainee_lname: '',
            trainee_email: '',
            trainee_start_date: '',
            trainee_end_date: '',
			trainee_bench_start_date: '',
			trainee_bench_end_date: '',
			trainee_days_worked: '',
            currentUser: authService.currentUserValue,
            bankHolidays: 'True',
        }
    }
	
	//Working day
	onChangeWorkingDays(e) {
		this.setState({
			trainee_days_worked: e.target.value
		})
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
			trainee_bench_start_date: momentBusinessDays(endDate, 'DD-MM-YYYY').businessAdd(1)._d ,
			trainee_bench_end_date: momentBusinessDays(endDate, 'DD-MM-YYYY').businessAdd(60)._d ,
        })
    }

    onClickBursary(e){
        if(this.state.bursary==="False"){
            this.setState({
                bursary: "True",
                bursary_amount: 30,
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
        });
    }
	
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
                    trainee_days_worked: response.data.trainee_days_worked,
                    trainee_bursary: response.data.bursary,
                    bursary_amount: response.data.bursary_amount
                })

                if(response.data.bursary === 'True'){
                    console.log(response.data.bursary);
                    this.setState({
                        bursary: "True",
                        open: true
                    })
                }
                else if(response.data.bursary === 'False'){
                    console.log(response.data.bursary);
                    this.setState({
                        bursary: "False",
                        open: false
                    })
                }
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
	  e.preventDefault();
		if(this.state.trainee_start_date === '' || this.state.trainee_end_date === ''){
            alert('Please select the training start/end dates');
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
		else if(this.state.trainee_days_worked > 31 ){
            alertDeterminer = "HighWorkingDays";
        }
		var alertDeterminer;
		 switch (alertDeterminer){
            case "HighWorkingDays":
                var dateWarning = window.confirm("The Amount of working days to be paid for is higher than the amount of working days within the Month. Are you sure you want to proceed?");
                
				if (dateWarning == false){
                break;
                }
			default:

        const obj = {
            trainee_start_date: this.state.trainee_start_date,
            trainee_end_date: this.state.trainee_end_date,
			trainee_bench_start_date:this.state.trainee_bench_start_date,
			trainee_bench_end_date:this.state.trainee_bench_end_date,
		}
		const workingDays = {
			trainee_days_worked: this.state.trainee_days_worked,
        }
        const bursary = {
            trainee_bursary: this.state.bursary,
            trainee_bursary_amount: this.state.bursary_amount
        }
		
        console.log(obj);
        console.log(bursary);
        axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/editDates/'+this.props.match.params.id, obj)
            .then(res => {console.log(res.data);
                          this.props.history.push('/');
                          window.location.reload();});
		axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/daysToWork/'+this.props.match.params.id, workingDays)
            .then(res => {console.log(res.data);
                          this.props.history.push('/');
                          window.location.reload();});
        axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/editBursary/'+this.props.match.params.id, bursary)
                .then(res => {console.log(res.data);
                             this.props.history.push('/');
                             window.location.reload();});                 
    }
	
}


    render() {
        console.log(this.state.bursary)
        const {bursary} = this.state;
		if(this.state.currentUser.token.role === 'admin' || this.state.currentUser.token.role === 'recruiter'){
        return (
            <div className="QATable">
                <form className="edit-form" onSubmit={this.onSubmit}>
                    <div className="all-edit-box">
                        <center><button id="cancelBtn" onClick={() => { document.location.href = "/"; }}>Cancel</button></center>
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
					
                    <div className="form-group">
                        <label>Bursary: </label>    
                        &nbsp;&nbsp;
                        <input type="checkbox" id="bursaryValue" checked={this.state.open} onClick={this.onClickBursary}/>
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

                    <div id="bursaryDates">
                    <label> Training Start Date : </label>
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
                        <label> Training End Date : </label>
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
                    {bursary ?
                        <div className="form-group">
                        <label>Amount of working days to be paid this month:</label>
						<br></br>
                        <input 
                                type="number" 
                                className="workingDays"
                                value={this.state.trainee_days_worked}
                                onChange={this.onChangeWorkingDays}
								required/>
                    </div>
                    : ""}
                    <br />
                    <div className="form-group">
                            <input id="updateBtn" type="submit" value="Update" className="btn btn-primary" /> &nbsp;
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