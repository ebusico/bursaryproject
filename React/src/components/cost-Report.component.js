import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import Collapse from 'react-bootstrap/Collapse'
// import '../css/list-trainee-recruiter.css';
import moment from 'moment';

export default class CostReport extends Component {
    
    constructor(props) {
        super(props);
			
        this.state = {
			trainees: [], 
            currentUser: authService.currentUserValue,
            staffEmail: '',
            date: '',
            totals : {
                amountPayable: 0,
                daysPayable: 0,
                dailyPayments: 0,
                status: ''
            },
            button:'',
            month: '',
            year: ''
            };
        
       //Added onChangeSearch - Ernie
       this.onChangeYear = this.onChangeYear.bind(this);
       this.onChangeMonth = this.onChangeMonth.bind(this);
       this.onSubmit = this.onSubmit.bind(this);
    }
    
    componentDidMount() {
            axios.post('http://' + process.env.REACT_APP_AWS_IP + ':4000/trainee/getMonthlyReport', {month: moment().format("MMMM YYYY")}).then(response => {
                if(response.data === 'no report'){
                    console.log('No reports found');
                } else{
                    console.log(response.data);
                    console.log(response.data.month)
                    if(response.data.status === 'PendingApproval'){
                        response.data.status = 'Pending Approval';
                    }
                let totalDays = 0;
                let totalAmount = 0;
                let traineeAmount = 0;
                this.setState({
                    trainees: response.data.reportTrainees,
                    date: response.data.month
                })
                console.log(this.state.date)
                response.data.reportTrainees.map(reportTrainee =>{
                    totalDays = totalDays + parseInt(reportTrainee.trainee_days_worked)
                    console.log(reportTrainee.bursary_amount)
                    traineeAmount = reportTrainee.trainee_days_worked*reportTrainee.bursary_amount
                    totalAmount = totalAmount + traineeAmount
                    this.setState({
                        totals:{
                            amountPayable: totalAmount,
                            daysPayable: totalDays,
                            status: response.data.status
                        }
                    });
                })
                }
            })
            

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
                  staffEmail: response.data.email
                })
              }
            });

            if(this.state.totals.status === 'AdminApproved' || this.state.totals.status === 'FinanceApproved'){
                this.setState({
                    button: 'false'
                });
            }
    }

    onChangeYear(e) {
        console.log(e.target.value);
        this.setState({
            year: e.target.value
        })
    }

    onChangeMonth(e){
        console.log(e.target.value);
        this.setState({
            month: e.target.value
        })
    }

    onSubmit(e){
        let added = this.state.month + this.state.year;
        console.log(added);
        console.log(added.replace(/\s+/g, ''));
        this.setState({
            totals:{
                date: added
            }
        })
    }
	
    render() {
        //Declared variables in order to read input from search function
        let trainees = this.state.trainees;
        let Headings = 0;

		if (this.state.currentUser.token.role === undefined){
			return (
			<AccessDenied/>
			)    
        }
        else if(this.state.currentUser.token.role === 'admin'){
            return (
                <div className="QAtable">
                <div className>
                <div>
                <h1>Cost Report - {this.state.date}</h1>
                <br></br>
                <table cellPadding="20">
                    <tbody>                          
                            <tr><th>Month</th> <td>{this.state.date}</td></tr>
                            <tr><th>Total Days Payable</th><td> {this.state.totals.daysPayable}</td></tr>
                            <tr><th>Amount Payable (£)</th><td> {this.state.totals.amountPayable}</td></tr>
                            <tr><th>Status</th><td> {this.state.totals.status}</td></tr>
                    </tbody>
                </table>
                </div>
                <div>{Headings}</div>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Start Date</th>
                            <th>Recruited By</th>
                            <th>Days payable</th>
                            <th>Payment per day</th>
                            <th>Total payment</th>
                        </tr>
                    </thead>               
                    <tbody>
                        {trainees.map(t => {
                            if(t.status != "Suspended"){
                                Headings = Headings+parseInt(t.trainee_days_worked)
                                return (
                                    <tr>
                                        <td>{t.trainee_fname}</td>
                                        <td id="email"> <a href={"mailto:"+t.trainee_email}>{t.trainee_email} </a></td>
                                        <td>{moment(t.trainee_start_date).format("DD/MM/YYYY")}</td>
                                        <td>{t.added_By}</td>
                                        <td>{t.trainee_days_worked}</td>
                                        <td>£{t.bursary_amount}</td>
                                        <td>£{t.bursary_amount*t.trainee_days_worked}</td>
                                    </tr>
                                );
                            }
                        })}
                    </tbody>

                </table>
                </div>
                </div>
            );
        }
        else{
        return (
            <div className="QAtable">
            <div className="detailsDiv">
            <div className="heading">
            <h1>Cost Report</h1>
            <br></br>
            <table className="trainee_table" cellPadding="20">
                <tbody id="detailstbody">                          
                        <tr><th>Month</th> <td>{this.state.totals.date}</td></tr>
                        <tr><th>Days Payable</th><td> {this.state.totals.daysPayable}</td></tr>
                        <tr><th>Amount Payable (£)</th><td> {this.state.totals.amountPayable}</td></tr>
                        <tr><th>Status</th><td> {this.state.totals.status}</td></tr>
                        <tr> </tr>
                </tbody>
            </table>
            </div>
            </div>
            </div>
        );
		}
	}
}