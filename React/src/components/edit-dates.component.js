import React, { Component } from 'react';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import '../css/edit-list-trainee.css';
import "react-datepicker/dist/react-datepicker.css";
import momentBusinessDays from 'moment-business-days';

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
		
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            trainee_fname: '',
            trainee_lname: '',
            trainee_email: '',
            trainee_start_date: '',
            trainee_end_date: '',
			trainee_bench_start_date: '',
			trainee_bench_end_date: '',
			currentUser: authService.currentUserValue
        }
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
                var trainee_fname  = CryptoJS.AES.decrypt(response.data.trainee_fname, codes.trainee);
                var trainee_lname  = CryptoJS.AES.decrypt(response.data.trainee_lname, codes.trainee);
                var trainee_email  = CryptoJS.AES.decrypt(response.data.trainee_email, codes.staff, {iv:codes.iv});
                var trainee_start_date = CryptoJS.AES.decrypt(response.data.trainee_start_date, codes.trainee);
                var trainee_end_date = CryptoJS.AES.decrypt(response.data.trainee_end_date, codes.trainee);
                var benchStartDate = CryptoJS.AES.decrypt(response.data.trainee_bench_start_date.toString(), codes.trainee);
				var benchEndDate = CryptoJS.AES.decrypt(response.data.trainee_bench_end_date.toString(), codes.trainee);
                
                this.setState({
                    trainee_fname: trainee_fname.toString(CryptoJS.enc.Utf8),
                    trainee_lname: trainee_lname.toString(CryptoJS.enc.Utf8),
                    trainee_email: trainee_email.toString(CryptoJS.enc.Utf8),
                    trainee_start_date: new Date (trainee_start_date.toString(CryptoJS.enc.Utf8)),
                    trainee_end_date: new Date (trainee_end_date.toString(CryptoJS.enc.Utf8)),
					trainee_bench_start_date: new Date (benchStartDate.toString(CryptoJS.enc.Utf8)),
					trainee_bench_end_date: new Date(benchEndDate.toString(CryptoJS.enc.Utf8)),
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
        e.preventDefault();
        var start = CryptoJS.AES.encrypt(this.state.trainee_start_date.toString(), codes.trainee);
        var end = CryptoJS.AES.encrypt(this.state.trainee_end_date.toString(), codes.trainee);

        const obj = {
            trainee_start_date: start.toString(),
            trainee_end_date: end.toString(),
        };
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