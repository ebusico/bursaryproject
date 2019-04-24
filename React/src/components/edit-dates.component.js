import React, { Component } from 'react';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import '../css/edit-list-trainee.css';
import { DropdownList } from 'react-widgets'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default class EditDates extends Component {
    
    constructor(props) {
        super(props);
        
        this.onChangeTraineeFname = this.onChangeTraineeFname.bind(this);
        this.onChangeTraineeLname = this.onChangeTraineeLname.bind(this);
        this.onChangeTraineeEmail = this.onChangeTraineeEmail.bind(this);
        this.onChangeStartDate = this.onChangeStartDate.bind(this);
        this.onChangeEndDate = this.onChangeEndDate.bind(this);
        
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            trainee_fname: '',
            trainee_lname: '',
            trainee_email: '',
            trainee_start_date: '',
            trainee_end_date: '',
			currentUser: authService.currentUserValue
        }
    }
    
    componentDidMount() {
        axios.get('http://localhost:4000/trainee/'+this.props.match.params.id)
            .then(response => {
                console.log(response);
                var trainee_fname  = CryptoJS.AES.decrypt(response.data.trainee_fname, codes.trainee);
                var trainee_lname  = CryptoJS.AES.decrypt(response.data.trainee_lname, codes.trainee);
                var trainee_email  = CryptoJS.AES.decrypt(response.data.trainee_email, codes.staff, {iv:codes.iv});
                var trainee_start_date = CryptoJS.AES.decrypt(response.data.trainee_start_date, codes.trainee);
                var trainee_end_date = CryptoJS.AES.decrypt(response.data.trainee_end_date, codes.trainee);
                
                
                this.setState({
                    trainee_fname: trainee_fname.toString(CryptoJS.enc.Utf8),
                    trainee_lname: trainee_lname.toString(CryptoJS.enc.Utf8),
                    trainee_email: trainee_email.toString(CryptoJS.enc.Utf8),
                    trainee_start_date: new Date (trainee_start_date.toString(CryptoJS.enc.Utf8)),
                    trainee_end_date: new Date (trainee_end_date.toString(CryptoJS.enc.Utf8))
                })
                console.log(this.state.trainee_start_date);
                console.log(this.state.trainee_end_date);   
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

        console.log(this.state.trainee_end_date);
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
        axios.post('http://localhost:4000/trainee/editDates/'+this.props.match.params.id, obj)
            .then(res => console.log(res.data));
        
        this.props.history.push('/editDates/'+this.props.match.params.id);
        window.location.reload();
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
                            <DatePicker
                                selected={this.state.trainee_start_date}
                                selectsStart
                                startDate={this.state.trainee_start_date}
                                endDate={this.state.trainee_end_date}
                                onChange={this.onChangeStartDate}
                                dateFormat="dd/MM/yyyy"
                            />
                    </div>
                    <div id="bursaryDates">
                        <label> Bursary End Date : </label>
                        <br></br>
                            <DatePicker
                                selected={this.state.trainee_end_date}
                                selectsEnd
                                startDate={this.state.trainee_start_date}
                                endDate={this.state.trainee_end_date}
                                onChange={this.onChangeEndDate}
                                dateFormat="dd/MM/yyyy"
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