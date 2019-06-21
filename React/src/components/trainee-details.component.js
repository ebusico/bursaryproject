import React, { Component } from 'react';
import axios from 'axios';
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
        axios.get('https://'+process.env.REACT_APP_BACKEND_IP+'/trainee/'+this.props.match.params.id)
            .then(response => {
                console.log(response.data);
                this.setState({
                    trainee_fname: response.data.trainee_fname,
                    trainee_lname: response.data.trainee_lname,
                    trainee_email: response.data.trainee_email,
                    trainee_start_date: response.data.trainee_start_date,
                    trainee_end_date: response.data.trainee_end_date,
                    trainee_bank_name: response.data.trainee_bank_name,
                    trainee_sort_code: response.data.trainee_sort_code,
                    trainee_account_no: response.data.trainee_account_no,
                    trainee_bursary: response.data.bursary,
                    csv: [["Trainee/Payee Name", "Account Number", "Sort Code", "Total Value", "DecimalPlace", "Append", "Data to Copy to Notepad"],[response.data.trainee_fname +" "+ response.data.trainee_lname, response.data.trainee_account_no, response.data.trainee_sort_code, "0.00", "2","000",response.data.trainee_sort_code+','+response.data.trainee_fname+' '+response.data.trainee_lname+','+response.data.trainee_account_no+','+"0"+".00"+','+"BURSARY"+','+"99"]]
                });
                console.log(this.state.trainee_start_date);
                console.log(this.state.trainee_end_date);
                
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
                <h1>Trainee Details</h1>
                <br></br>
                <table onSubmit={this.onSubmit} className="trainee_table" cellPadding="20">
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
                            </tr>
                    </tbody>
                </table>
                </div>
                </div>
            </div>

        )
	} else if(this.state.currentUser.token._id === this.props.match.params.id && this.state.trainee_bursary === "True") {
		return (
		<div className="details">
            <div className="detailsDiv">
                <div className="heading">
                <h1>Your Details</h1>
                <br></br>
                <table onSubmit={this.onSubmit} className="trainee_table" cellPadding="20">
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
                                <form><input type="submit" value="Edit" className="edit-btn" /></form>
                            </td>
                            </tr>
                    </tbody>
                </table>
                </div>
                </div>
            </div>
        );
    }else if(this.state.currentUser.token._id === this.props.match.params.id){
        return(
            <div className="details">
            <div className="detailsDiv">
                <div className="heading">
                <h1>Your Details</h1>
                <br></br>
                <table onSubmit={this.onSubmit} className="trainee_table" cellPadding="20">
                    <tbody id="detailstbody">
                            <tr><th>First Name</th><td>{this.state.trainee_fname}</td></tr>
                            <tr><th>Last Name</th><td>{this.state.trainee_lname}</td></tr>
                            <tr><th>Email</th><td>{this.state.trainee_email}</td></tr>
							<tr><th>Start Date</th><td>{moment(this.state.trainee_start_date).format('MMMM Do YYYY')}</td></tr>
                            <tr><th>End Date</th><td>{moment(this.state.trainee_end_date).format('MMMM Do YYYY')}</td></tr>
                           
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

