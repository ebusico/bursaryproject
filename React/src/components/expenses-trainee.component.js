import React, { Component } from 'react';
import axios from 'axios';
import '../css/history.css';
import { authService } from './modules/authService';
import AccessDenied from './modules/AccessDenied';
import { Button, ButtonGroup } from 'reactstrap';
import close from './icons/close2.svg';


export default class TraineeExpenses extends Component {

    constructor(props) {
        super(props);

        this.clearAll = this.clearAll.bind(this);

        this.state = {
            userType: '',
            recordOf: '',
            record: [],
            currentUser: authService.currentUserValue,
            expArray: [],
            monthly_expenses: 0,
            expenseType: '',
            other: false
        }
    }
    
    onSave = () => {
    
    
        axios.post('http://' + process.env.REACT_APP_AWS_IP + ':4000/admin/expenses/'+this.props.match.params.id, {expenseType: this.state.expenseType, amount: this.state.monthly_expenses })
        .then(res => {
            console.log(res.data);
            window.location.reload();
        });
    }

    onChange = (e) => this.setState({ monthly_expenses: e.target.value });


    onSelect = (e) => {
        if(e.target.value === "Other"){
            this.setState({
                other: true
            });
        }
        else{
            this.setState({
                other: false
            });
        }
        this.setState({
            expenseType: e.target.value
        });
    }

    onOtherAdd = (e) => {
        this.setState({
            expenseType: "Other("+e.target.value+")"
        })
    }

    clearAll() {
        this.setState({
            expArray: [],
        })
    }

    componentDidMount() {
        axios.get('http://' + process.env.REACT_APP_AWS_IP + ':4000/admin/getRecord/' + this.props.match.params.id)
            .then(response => {
                this.setState({ record: response.data });
                console.log(this.state.record)
            })
            .catch(function (error) {
                console.log(error);
            })
        axios.get('http://' + process.env.REACT_APP_AWS_IP + ':4000/admin/staff/' + this.props.match.params.id)
            .then(response => {
                if (response.data === null) {
                    axios.get('http://' + process.env.REACT_APP_AWS_IP + ':4000/trainee/' + this.props.match.params.id)
                        .then(response => {
                            if (response.data === null) {
                                this.setState({ recordOf: 'Not Found', userType: 'User' });
                            }
                            else {
                                this.setState({ recordOf: response.data.trainee_fname + " " + response.data.trainee_lname, userType: 'Trainee' });
                            }
                        })
                }
                else {
                    this.setState({ recordOf: response.data.email, userType: 'Staff' });
                }
            })
            .catch(function (error) {
                console.log(error);
            })

        axios.get('http://' + process.env.REACT_APP_AWS_IP + ':4000/admin/getexp/'+this.props.match.params.id)
        .then(response => {
            response.data.monthly_expenses.map(expenses=>
                {
                    let nextExpense = {"amount":expenses.amount,"type":expenses.expenseType};
            
                    this.state.expArray.push(nextExpense);
                }
                )
            console.log(response)
        })
    };

    render() {
        if (this.state.currentUser.token.role !== 'admin') {
            return (
                <AccessDenied />
            )
        }
        else {
            let recordOf = this.state.recordOf;
            let userType = this.state.userType;
            let other = this.state.other;
            const { expArray, monthly_expenses, expenseType } = this.state;
            return (
                <div className="BigBox">
                    <div className="QAtable">
                        <div>
                            <h2>Expenses for {userType} - {recordOf}</h2>
                            <hr />
                            <div>
                                &nbsp;&nbsp;&nbsp;<label>Amount (£): </label>&nbsp;&nbsp;
                                <input style={{marginBlock:30}} value={monthly_expenses} onChange={this.onChange} type="number" min="0"></input> &nbsp;&nbsp;&nbsp;&nbsp;
                                <label>Type: </label>&nbsp;&nbsp;
                                <select id="expenseType" value={expenseType} onChange={this.onSelect}>
                                    <option selected value="">Select expense type</option>
                                    <option value="Air fares">Air fares</option>
                                    <option value="Car hire">Car hire</option>
                                    <option value="Computer consumables">Computer consumables</option>
                                    <option value="Customer Entertainment(customer)">Customer entertainment(customer)</option>
                                    <option value="Customer Entertainment(staff)">Customer entertainment(staff)</option>
                                    <option value="Hotels/Accomodation">Hotels/Accomodation</option>
                                    <option value="Meals">Meals</option>
                                    <option value="Fuel">Fuel</option>
                                    <option value="Other">Other</option>
                                    <option value="Parking/Tolls">Parking/Tolls</option>
                                    <option value="Postage">Postage</option>
                                    <option value="Public Transport">Public Transport</option>
                                    <option value="Staff Entertainment">Staff Entertainment</option>
                                    <option value="Stationary">Stationary</option>
                                    <option value="Subscription and req. fees">Subscription and req. fees</option>
                                    <option value="Taxi Fares">Taxi Fares</option>
                                    <option value="Training Materials">Training Materials</option>
                                </select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <ButtonGroup>  <Button type="submit" id="createExpenseBtn" onClick={this.onSave}>Add</Button> </ButtonGroup>
                                {other ? 
                                <div id="OtherInput">
                                    <label>Expense Type :</label>&nbsp;
                                    <input 
                                    onChange={this.onOtherAdd}
                                    placeholder="Enter Expense Type Here"
                                    />
                                </div>:""}
                                <table id="logTable" className="table table-striped" style={{ marginTop: 20 }} >
                                    <thead>
                                        <tr>
                                            <th>Expenses</th>
                                            <th>Amount(£)</th>
                                            <th>Actions</th>
                                        </tr>

                                    </thead>
                                    <tbody>
                                        {expArray.map(monthly_expenses => {
                                            return (
                                                <tr>
                                                    <td>{monthly_expenses.type}</td>
                                                    <td>£{monthly_expenses.amount}</td>
                                                    <td><button className="actionBtn" onClick={() => { 
                                                            if (window.confirm('Are you sure you wish to delete this expense?'))
                                                            axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/admin/removeExpenses/'+this.props.match.params.id, {"expenseType": monthly_expenses.type, "amount": monthly_expenses.amount }).then(() => window.location.reload()) } }>
                                                            Delete
                                                            <img src={close}></img>
                                        </button></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table >
                            </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <ButtonGroup>
                                    <Button type="submit" id="createExpenseBtn" style={{ marginBottom:30}} onClick={() => { document.location.href = "/"; }}>⭠ Back</Button>
                            </ButtonGroup>

                        </div>
                    </div>
                </div>

            )
        }
    }
}
