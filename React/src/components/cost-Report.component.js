import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import Collapse from 'react-bootstrap/Collapse'
import '../css/list-trainee-recruiter.css';
import moment from 'moment';

export default class CostReport extends Component {
    
    constructor(props) {
        super(props);
			
        this.state = {
			trainees: [], 
            currentUser: authService.currentUserValue,
            staffEmail: '',
            totals : {
                amountPayable: 0,
                daysPayable: 0,
                dailyPayments: 0,
                date: '',
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
            axios.get('http://' + process.env.REACT_APP_AWS_IP + ':4000/trainee/monthlyReport/c').then(response => {
                if(response.data === 'no report'){
                    console.log('No reports found');
                } else{
                    console.log(response.data);
                    if(response.data.status === 'PendingApproval'){
                        response.data.status = 'Pending Approval';
                    }
                let totalDays = 0;
                let totalAmount = 0;
                let traineeAmount = 0;
                response.data.reportTrainees.map(reportTrainee =>{
                    totalDays = totalDays + parseInt(reportTrainee.days_worked)
                    traineeAmount = reportTrainee.days_worked*reportTrainee.bursary_amount
                    totalAmount = totalAmount + traineeAmount
                    this.setState({
                        totals:{
                            amountPayable: totalAmount,
                            daysPayable: totalDays,
                            date: 'June 2019',
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
        console.log(this.state.totals.date);


		if (this.state.currentUser.token.role === undefined){
			return (
			<AccessDenied/>
			)    
        }
        else if(this.state.currentUser.token.role === 'admin'){
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