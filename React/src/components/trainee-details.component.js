import React, { Component } from 'react';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";
import { CSVLink } from "react-csv";
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import moment from 'moment';
import '../css/trainee-details.css';


export default class TraineeDetails extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
			id: '',
			trainee_fname: '',
            trainee_lname: '',
            trainee_email: '',
			trainee_bank_name: '', 
            trainee_account_no: '',
            trainee_sort_code: '',
            trainee_approved: false,
			currentUser: authService.currentUserValue,
            trainee_start_date: '',
            trainee_end_date: '',
            csv: []
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/'+this.props.match.params.id)
            .then(response => {
                console.log(Date(response.data.trainee_end_date));
                if(response.data.trainee_account_no != null && response.data.trainee_sort_code != null){
                    var trainee_account_no = CryptoJS.AES.decrypt(response.data.trainee_account_no, codes.trainee).toString(CryptoJS.enc.Utf8);
                    var trainee_sort_code = CryptoJS.AES.decrypt(response.data.trainee_sort_code, codes.trainee).toString(CryptoJS.enc.Utf8);
                    var trainee_bank_name = CryptoJS.AES.decrypt(response.data.trainee_bank_name, codes.trainee).toString(CryptoJS.enc.Utf8);
					this.setState({
                        trainee_account_no: trainee_account_no,
                        trainee_sort_code: trainee_sort_code,
						trainee_bank_name: trainee_bank_name,
                    }) 
                }
                var trainee_fname  = CryptoJS.AES.decrypt(response.data.trainee_fname, codes.trainee).toString(CryptoJS.enc.Utf8);
                var trainee_lname  = CryptoJS.AES.decrypt(response.data.trainee_lname, codes.trainee).toString(CryptoJS.enc.Utf8);
                var trainee_email  = CryptoJS.AES.decrypt(response.data.trainee_email, codes.staff, {iv: codes.iv}).toString(CryptoJS.enc.Utf8);
                var trainee_start_date = CryptoJS.AES.decrypt(response.data.trainee_start_date, codes.trainee).toString(CryptoJS.enc.Utf8);
                var trainee_end_date = CryptoJS.AES.decrypt(response.data.trainee_end_date, codes.trainee).toString(CryptoJS.enc.Utf8);
                this.setState({
                    trainee_fname: trainee_fname,
                    trainee_lname: trainee_lname,
                    trainee_email: trainee_email,
                    trainee_start_date: trainee_start_date,
                    trainee_end_date: trainee_end_date,
                    csv: [["Trainee/Payee Name", "Account Number", "Sort Code", "Total Value", "DecimalPlace", "Append", "Data to Copy to Notepad"],[trainee_fname +" "+ trainee_lname, trainee_account_no, trainee_sort_code, "0.00", "2","000",trainee_sort_code+','+trainee_fname+' '+trainee_lname+','+trainee_account_no+','+"0"+".00"+','+"BURSARY"+','+"99"]]
                }) 
                
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    onSubmit(e) {
        
        this.props.history.push('/edit/'+this.props.match.params.id);
    }

render() {

	if(this.state.currentUser.token.role === 'finance') {
        return (
            <div className="details">
                <div className="detailsDiv">
                <div className="heading">
                <h2>Trainee Details</h2>
                <table onSubmit={this.onSubmit} className="trainee_table" cellPadding="20">
                <br></br>
                    <tbody id="detailstbody">
                            <tr><th>First Name</th><td>{this.state.trainee_fname}</td></tr>
                            <tr><th>Last Name</th><td>{this.state.trainee_lname}</td></tr>
                            <tr><th>Email</th><td>{this.state.trainee_email}</td></tr>
                            <tr><th>Start Date</th><td>{moment(this.state.trainee_start_date).format('MMMM Do YYYY')}</td></tr>
                            <tr><th>End Date</th><td>{moment(this.state.trainee_end_date).format('MMMM Do YYYY')}</td></tr>
							<tr><th>Bank Name</th><td>{this.state.trainee_bank_name}</td></tr>
                            <tr><th>Account Number</th><td>{this.state.trainee_account_no}</td></tr>
                            <tr><th>Sort Code</th><td>{this.state.trainee_sort_code}</td></tr>
                            <tr>
                            <th></th>
                            <td>
                                <CSVLink data={this.state.csv} filename='trainee-details.csv'>Download CSV </CSVLink>
                            </td>
                            </tr>
                    </tbody>
                </table>
                </div>
                </div>
            </div>

        )
	} else if(this.state.currentUser.token._id === this.props.match.params.id) {
		return (
		<div className="details">
            <div className="detailsDiv">
                <div className="heading">
                <h2>Your Details</h2>
                <table onSubmit={this.onSubmit} className="trainee_table" cellPadding="20">
                <br></br>
                    <tbody id="detailstbody">
                            <tr><th>First Name</th><td>{this.state.trainee_fname}</td></tr>
                            <tr><th>Last Name</th><td>{this.state.trainee_lname}</td></tr>
                            <tr><th>Email</th><td>{this.state.trainee_email}</td></tr>
							<tr><th>Start Date</th><td>{moment(this.state.trainee_start_date).format('MMMM Do YYYY')}</td></tr>
                            <tr><th>End Date</th><td>{moment(this.state.trainee_end_date).format('MMMM Do YYYY')}</td></tr>
							<tr><th>Bank Name</th><td>{this.state.trainee_bank_name}</td></tr>
                            <tr><th>Account Number</th><td>{this.state.trainee_account_no}</td></tr>
                            <tr><th>Sort Code</th><td>{this.state.trainee_sort_code}</td></tr>
                            <tr>
                                <th></th>
                        
                            <td>
                                <br></br>
                                <form><input type="submit" value="Edit" className="edit-btn" /></form>
                            </td>
                            </tr>
                    </tbody>
                </table>
                </div>
                </div>
            </div>
		);
	}else{ 
	return(
		< AccessDenied />
	);}
    }
}

