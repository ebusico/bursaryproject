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
                date: moment().format('MMMYYYY'),
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
        // axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/')
        //     .then(response => {
        //         this.setState({trainees: response.data});
        //         this.state.trainees.map(t => {
        //             this.setState({ totals: {
        //                 amountPayable : this.state.totals.amountPayable + parseFloat(t.bursary_amount) * parseFloat(t.trainee_days_worked),
        //                 daysPayable: this.state.totals.daysPayable + parseFloat(t.trainee_days_worked),
        //                 dailyPayments: this.state.totals.dailyPayments + parseFloat(t.bursary_amount),
        //                 date: moment().format('MMM YYYY').toString()
        //             }
        //             });
        //         })
        //     })
        //     .catch(function (error){
        //         console.log(error);
        //     })

            // set date as current month and year before below get
            axios.get('http://' + process.env.REACT_APP_AWS_IP + ':4000/trainee/monthlyReport/' + this.state.totals.date).then(response => {
                if(response.data === 'no report'){
                    console.log('No reports found');
                } else{
                    console.log(response.data);
                    this.setState({
                        totals:{
                            amountPayable: response.data.totalAmount,
                            daysPayable: response.data.totalDays,
                            dailyPayments: response.data.totalDailyPayments,
                            date: response.data.month,
                            status: response.data.status
                        }
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

    // Added onChangeSearch(e) function. Needed for the search filter

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
                <label>Month</label> &nbsp;
                <select onChange={this.onChangeMonth}>
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>&nbsp;&nbsp;
                <label>Year</label>&nbsp;
                <input value={this.state.year} placeholder="e.g. 2019" onChange={this.onChangeYear}/>&nbsp;&nbsp;
                <button type="submit"> Find Report </button>
                <div className="heading">
                <h1>Cost Report</h1>
                <br></br>
                <table className="trainee_table" cellPadding="20">
                    <tbody id="detailstbody">                          
                            <tr><th>Month</th> <td>{this.state.totals.date}</td></tr>
                            <tr><th>Daily Payments (£)</th><td> {this.state.totals.dailyPayments}</td></tr>
                            <tr><th>Days Payable</th><td> {this.state.totals.daysPayable}</td></tr>
                            <tr><th>Amount Payable (£)</th><td> {this.state.totals.amountPayable}</td></tr>
                            <tr> </tr>
                    </tbody>
                </table>
                </div>
                <div className="QASearchBar">
                    <button className="approveBtn" disabled={this.state.button}>Approve</button>
                </div>
                </div>
                </div>
                // <div className="QAtable">
                //     <div className="QASearchBar">
                        
                //     </div>
    
                //     <table className="table table-striped" style={{ marginTop: 20 }} >
                //         <thead>
                //             <tr>
                //                 <th>Month</th>
                //                 <th>Daily Payments (£)</th>
                //                 <th>Days Payable</th>
                //                 <th>Amount Payable (£)</th>
                //             </tr>
                //         </thead>               
                //         <tbody>
                //             <tr>
                //                 <td> {moment().format('MMM YYYY')}</td>
                //                 <td> {this.state.totals.dailyPayments}</td>
                //                 <td> {this.state.totals.daysPayable}</td>
                //                 <td> {this.state.totals.amountPayable}</td>
                //                 </tr>
                //         </tbody>
    
                //     </table>
                // </div>
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
                        <tr><th>Daily Payments (£)</th><td> {this.state.totals.dailyPayments}</td></tr>
                        <tr><th>Days Payable</th><td> {this.state.totals.daysPayable}</td></tr>
                        <tr><th>Amount Payable (£)</th><td> {this.state.totals.amountPayable}</td></tr>
                        <tr> </tr>
                </tbody>
            </table>
            </div>
            <div className="QASearchBar">
                    <button className="approveBtn" disabled={this.state.button}>Approve</button>
            </div>
            </div>
            </div>
        );
		}
	}
}