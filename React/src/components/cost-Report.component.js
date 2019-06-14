import React, { Component } from 'react';
import ReactTable from "react-table";
import axios from 'axios';
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import Collapse from 'react-bootstrap/Collapse'
// import '../css/list-trainee-recruiter.css';
import moment from 'moment';
import "react-table/react-table.css";
import '../css/report.css'
import DayPicker, { DateUtils } from 'react-day-picker';
import DatePicker from "react-datepicker";
import 'react-day-picker/lib/style.css';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

export default class CostReport extends Component {
    
    constructor(props) {
        super(props);
			
        this.state = {
            report: true,
            trainee_data: [],
            currentUser: authService.currentUserValue,
            staffEmail: '',
            date: '',
            values : {
                amountPayable: 0,
                daysPayable: 0,
                dailyPayments: 0,
                status: '',
                bench_number: '',
                training_number: '',
                pending_number: '',
            },
            open: true,
            filterOpen: false,
            searchString: '',
            filter: {
                myTrainees: false,
                status: 'All',
                pending: false
            },
            range:{
                from: undefined,
                to: undefined,
            },
            modal: false,
            tableDays: 0,
            tableTotal: 0,
            startDate: ''
            };
        
        this.onChangeStatusFilter = this.onChangeStatusFilter.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleDaysClicked = this.handleDaysClicked.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
        this.onChangePendingFilter = this.onChangePendingFilter.bind(this);
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.onSubmit = this.onSubmit.bind(this); 
        this.updateReport = this.updateReport.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    componentDidMount() {
        axios.post('http://' + process.env.REACT_APP_AWS_IP + ':4000/trainee/monthlyReport', {month: moment().format("MMMM YYYY")})
            .then( () => {
                axios.post('http://' + process.env.REACT_APP_AWS_IP + ':4000/trainee/getMonthlyReport', {month: moment().format("MMMM YYYY")}).then(response => {
                    if(response.data === 'no report'){
                        console.log('No reports found');
                    } else{
                        console.log(response.data);
                        console.log(response.data.month)
                        let totalDays = 0;
                        let totalAmount = 0;
                        let traineeAmount = 0;
                        let training = 0;
                        let bench = 0;
                        let pending = 0;
                        this.setState({
                            date: response.data.month,
                        })
                    response.data.reportTrainees.map(async reportTrainee =>{
                        let expenses = 0;
                        console.log(reportTrainee.monthly_expenses)
                        reportTrainee.monthly_expenses.map(expense =>{
                            expenses += parseInt(expense.amount);
                        })
                        if(reportTrainee.status === 'Pending'|| reportTrainee.status === 'Incomplete'){
                            await pending++
                        }
                        else if(moment(reportTrainee.trainee_bench_start_date).isAfter(moment(response.data.month, 'MMMM YYYY'))){
                            console.log("DATE IE"+moment(reportTrainee.trainee_bench_start_date).format('DD/MM/YYYY'))
                            await(reportTrainee.status = "Training");
                            await training++
                        }
                        else{
                            console.log("DATE IE"+moment(reportTrainee.trainee_bench_start_date).format('DD/MM/YYYY'));
                            console.log("REPORT DATE IE"+response.data.month)
                            await(reportTrainee.status = "Bench");
                            await bench++
                        }
                        let data = this.state.trainee_data
                        let trainee_row = {
                            name: reportTrainee.trainee_fname +' '+reportTrainee.trainee_lname,
                            email: reportTrainee.trainee_email,
                            displayStart: moment(reportTrainee.trainee_start_date).format('DD/MM/YYYY'),
                            start: reportTrainee.trainee_start_date,
                            recruitedBy: reportTrainee.added_By,
                            status: reportTrainee.status,
                            days: reportTrainee.trainee_days_worked,
                            bursary:{amountDay: reportTrainee.bursary_amount, amountMonth: reportTrainee.bursary_amount*reportTrainee.trainee_days_worked,},
                            totalMonth: reportTrainee.bursary_amount*reportTrainee.trainee_days_worked+expenses,
                            expenses : expenses
                        }
                        data.push(trainee_row)
                        this.setState({
                            trainee_data: data
                        })
                        console.log("DATA")
                        console.log(data)
                        if(reportTrainee.status === 'Training'||reportTrainee.status === 'Bench'){
                            totalDays = totalDays + parseInt(reportTrainee.trainee_days_worked)
                            console.log(reportTrainee.bursary_amount)
                            traineeAmount = reportTrainee.trainee_days_worked*reportTrainee.bursary_amount
                            totalAmount = totalAmount + traineeAmount
                            console.log(this.state.values.status)
                        }
                        this.setState({

                            values:{
                                amountPayable: totalAmount,
                                daysPayable: totalDays,
                                status: response.data.status.replace(/([A-Z])/g, ' $1').trim(),
                                bench_number: bench,
                                training_number: training,
                                pending_number: pending
                            }
                        });
                    })
                    }
                })
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

            if(this.state.values.status === 'AdminApproved' || this.state.values.status === 'FinanceApproved'){
                this.setState({
                    button: 'false'
                });
            }
    }

    onChangeSearch(e) {
        this.setState({
            searchString: e.target.value
        })
    }

    onChangeStatusFilter(e){
        var newVal = e.target.value;
        var newFilter = this.state.filter;
        newFilter.status = newVal
        this.setState({
            filter : newFilter
        })
    }

    onChangePendingFilter(e){
        var newVal = !this.state.filter.pending
        console.log(newVal)
        var newFilter = this.state.filter
        newFilter.pending = newVal
        this.setState({
            filter : newFilter
        })
    }

    toggle() {
        this.setState(prevState => ({
          modal: !prevState.modal
        })); 
    }

    handleDayClick(day, { selected }) {
        const { selectedDays } = this.state;
        const { splitDays } = this.state;
        if (selected) {
          const selectedIndex = selectedDays.findIndex(selectedDay =>
            DateUtils.isSameDay(selectedDay, day)
          );
        selectedDays.splice(selectedIndex, 1);
        splitDays.splice(selectedIndex, 1);
        } else {
          selectedDays.push(day);
           splitDays.push(day.toString().split(" ", 4).toString());
        }
        this.setState({ selectedDays });
    }

    handleDaysClicked(day) {
        const range = DateUtils.addDayToRange(day, this.state.range);
        this.setState({
            range: range});
    }

    handleResetClick() {
        this.setState({
            range: {
                from: undefined,
                to: undefined
            }
        });
    }

    updateReport(){
        let role = '';
        if (this.state.currentUser.token.role === "admin"){
            role = 'admin'
        }
        else if(this.state.currentUser.token.role === "finance"){
            role = 'finance'
        }
        axios.post('http://' + process.env.REACT_APP_AWS_IP + ':4000/trainee/monthlyReport/updateStatus', {month: this.state.date, user_role: role})
            .then(() =>{window.location.reload()})
    }

    handleChange(date) {
        this.setState({
            report: true,
            trainee_data: [],
            currentUser: authService.currentUserValue,
            staffEmail: '',
            date: '',
            values : {
                amountPayable: 0,
                daysPayable: 0,
                dailyPayments: 0,
                status: '',
                bench_number: '',
                training_number: '',
                pending_number: '',
            },
            open: true,
            filterOpen: false,
            searchString: '',
            filter: {
                myTrainees: false,
                status: 'All',
                pending: false
            },
            range:{
                from: undefined,
                to: undefined,
            },

            tableDays: 0,
            tableTotal: 0,
            startDate: ''
            });

        axios.post('http://' + process.env.REACT_APP_AWS_IP + ':4000/trainee/monthlyReport', {month: moment().format("MMMM YYYY")})
        .then( () => {
        axios.post('http://' + process.env.REACT_APP_AWS_IP + ':4000/trainee/monthlyReport', {month: moment(date).format("MMMM YYYY")})
        .then( () => {
            axios.post('http://' + process.env.REACT_APP_AWS_IP + ':4000/trainee/getMonthlyReport', {month: moment(date).format("MMMM YYYY")}).then(response => {
                console.log(response.data)
                if(response.data === 'no report' || response.data.reportTrainees.length === 0){
                    this.setState({
                        date: moment(date).format("MMMM YYYY"),
                        report: false
                    })
                    console.log('No reports found');
                } else{
                    console.log(response.data);
                    console.log(response.data.month)
                    response.data.status = response.data.status.replace(/([A-Z])/g, ' $1').trim()
                let totalDays = 0;
                let totalAmount = 0;
                let traineeAmount = 0;
                let training = 0;
                let bench = 0;
                let pending = 0;
                this.setState({
                    date: response.data.month,
                    status: response.data.status,
                })
                response.data.reportTrainees.map(async reportTrainee =>{
                    if(reportTrainee.status === 'Pending'|| reportTrainee.status === 'Incomplete'){
                        await pending++
                    }
                    else if(moment(reportTrainee.trainee_bench_start_date).isAfter(moment(response.data.month, 'MMMM YYYY'))){
                        console.log("DATE IE"+moment(reportTrainee.trainee_bench_start_date).format('DD/MM/YYYY'))
                        await(reportTrainee.status = "Training");
                        await training++
                    }
                    else{
                        console.log("DATE IE"+moment(reportTrainee.trainee_bench_start_date).format('DD/MM/YYYY'));
                        console.log("REPORT DATE IE"+response.data.month)
                        await(reportTrainee.status = "Bench");
                        await bench++
                    }
                    let data = this.state.trainee_data
                    let trainee_row = {
                        name: reportTrainee.trainee_fname +' '+reportTrainee.trainee_lname,
                        email: reportTrainee.trainee_email,
                        displayStart: moment(reportTrainee.trainee_start_date).format('DD/MM/YYYY'),
                        start: reportTrainee.trainee_start_date,
                        recruitedBy: reportTrainee.added_By,
                        status: reportTrainee.status,
                        days: reportTrainee.trainee_days_worked,
                        bursary:{amountDay: reportTrainee.bursary_amount, amountMonth: reportTrainee.bursary_amount*reportTrainee.trainee_days_worked,},
                        expenses : 0,
                        totalMonth: reportTrainee.bursary_amount*reportTrainee.trainee_days_worked
                    }
                    data.push(trainee_row)
                    this.setState({
                        trainee_data: data
                    })
                    if(reportTrainee.status === 'Training'||reportTrainee.status === 'Bench'){
                        totalDays = totalDays + parseInt(reportTrainee.trainee_days_worked)
                        console.log(reportTrainee.bursary_amount)
                        traineeAmount = reportTrainee.trainee_days_worked*reportTrainee.bursary_amount
                        totalAmount = totalAmount + traineeAmount
                        console.log("STATUS"+this.state.values.status)
                    }
                    this.setState({

                        values:{
                            amountPayable: totalAmount,
                            daysPayable: totalDays,
                            bench_number: bench,
                            training_number: training,
                            pending_number: pending
                        }
                    });
                })
                }
            })
        })})
        

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

        if(this.state.values.status === 'AdminApproved' || this.state.values.status === 'FinanceApproved'){
            this.setState({
                button: 'false'
            });
        }
        this.setState({
          startDate: date
        });
      }

    onSubmit(e){
        let added = this.state.month + this.state.year;
        console.log(added);
        console.log(added.replace(/\s+/g, ''));
        this.setState({
            values:{
                date: added
            }
        })
    }
	
    render() {
        let trainees = this.state.trainee_data;
        let searchString = this.state.searchString;
        let filter = this.state.filter;
        const {open} = this.state;
        const {filterOpen} = this.state;
        let range = this.state.range;
        const { from, to } = this.state.range;
        const modifiers = { start: from, end: to };
        let button;

        if(this.state.currentUser.token.role === "finance"){
            if(this.state.values.status == "Admin Approved"){
                button = <button className="actionBtn" onClick={this.updateReport}>Approve</button> 
            }
        }
        else if(this.state.currentUser.token.role === "admin"){
            if(this.state.values.status == "Pending Approval"){
                button = <button className="actionBtn" onClick={this.updateReport}>Approve</button> 
            }
        }


        if(this.state.report === false){
            return(
                <div className="QAtable">
                <div>
                <br/>
                <div id="addUser">
                        <button className="qabtn">Choose month</button>
                        <DatePicker
                            selected={this.state.startDate}
                            onChange={this.handleChange}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            placeholderText="MM/YYYY" 
                        />
                </div>
                <h1>Cost Report - {this.state.date}</h1>
                <p>No report found</p>
                </div>
                </div>
            )
        }

        if(searchString.length > 0){
            trainees = trainees.filter(function(i){
                if(i.name.toLowerCase().match(searchString.toLowerCase()) ||
                   i.status.toLowerCase().match(searchString.toLowerCase())        ||
                   i.recruitedBy.toLowerCase().match(searchString.toLowerCase())      ||
                   i.start.toString().match(searchString)       ||
                   i.days.toString().match(searchString) ||
                   i.bursary.amountMonth.toString().match(searchString) ||
                   i.email.toLowerCase().match(searchString.toLowerCase()) ||
                   (i.name.toLowerCase() + i.status.toLowerCase() + i.email.toLowerCase() + i.recruitedBy.toLowerCase()).match(searchString.toLowerCase())){
                    return i;
                }
            })
        }

        if(filter.status != 'All'){
            trainees = trainees.filter(function(trainee){
                if(trainee.status == filter.status){
                    console.log(trainee);
                    return trainee;
                }

            })
        }

        if(filter.pending === false){
            trainees = trainees.filter(function(trainee){
                if(trainee.status === 'Training'||trainee.status === 'Bench'){
                    return trainee;
                }
            })
        }

        if(from != undefined){
            if(to == undefined){
                trainees = trainees.filter(function(trainee){
                    let start = new Date(Date.parse(trainee.start));
                    if(DateUtils.isSameDay(start, from)){
                         return trainee;
                    }
                })
            }
            else if(to!= undefined){
                trainees = trainees.filter(function(trainee){
                    let start = new Date(Date.parse(trainee.start));
                    if(DateUtils.isDayInRange(start, range)){
                         return trainee;
                    }
                })
            }
        }


		if (this.state.currentUser.token.role === undefined){
			return (
			<AccessDenied/>
			)    
        }
        else{
            return (
                <div className="QAtable">
                <div>
                <div>
                <div>
                <br/>
                <div id="addUser">
                        <label>Choose Month :</label>&nbsp;
                        <DatePicker
                            selected={this.state.startDate}
                            onChange={this.handleChange}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            placeholderText="MM/YYYY" 
                        />
                </div>
                <h1 id="cRTitle">&nbsp;Cost Report - {this.state.date}</h1>
                </div>
                <br/>
                <table cellPadding='5'>
                    <tbody>                          
                            <tr>
                                &nbsp;&nbsp;<th>Status:</th><td>{this.state.values.status}</td>&nbsp;&nbsp;
                                <th>Amount Payable:</th><td>£{this.state.values.amountPayable}</td>&nbsp;&nbsp;
                                <th>Trainees in training:</th><td>{this.state.values.training_number}</td>&nbsp;&nbsp;
                                <th>Trainees on bench:</th><td>{this.state.values.bench_number}</td>&nbsp;&nbsp;
                                <th>Pending trainees:</th><td>{this.state.values.pending_number}</td>&nbsp;&nbsp;&nbsp;&nbsp;
                            </tr>
                    </tbody>
                </table>
                <br/>
                <p>&nbsp;&nbsp;&nbsp;Note: Pending trainees are not included in amount payable</p>
                <br/>
                </div>
                <button className="actionBtn" id="individual" onClick={() => this.setState({ open: !open })}>Individual Trainee Breakdown</button>&nbsp;&nbsp; 
                {button}
                <hr />
                <Collapse in={this.state.open}>
                <div>
                <div className="QASearchBar">
                    <input
                        type="text"
                        value={this.state.searchString}
                        onChange={this.onChangeSearch}
                        placeholder="Find Trainee.." 
                    />
                    <button
                    onClick={() => this.setState({ filterOpen: !filterOpen })}
                    className="filter-btn"
                    >
                    Filters
                    </button>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} className="dateModal">
                        <ModalHeader toggle={this.toggle} cssModule={{'modal-title':'w-100 text-center'}}>Select Start Dates</ModalHeader>
                        <ModalBody cssModule={{'modal-body':'w-100 text-center'}}>
                        <div className = "mod-body">
                        <DayPicker
                            className="Selectable"
                            numberOfMonths={this.props.numberOfMonths}
                            selectedDays={[from, { from, to }]}
                            modifiers={modifiers}
                            onDayClick={this.handleDaysClicked}
                        />
                        <p>
                            {from &&
                                to && (
                                <button className="resetBtn" onClick={this.handleResetClick}>
                                    Reset
                                </button>
                                )}
                        </p>
                        </div>
                        </ModalBody>
                    </Modal>
                    <br />
                    <Collapse in={this.state.filterOpen}>
                    <p>
                        <br></br>
                        <label>Trainee Status:</label> &nbsp;
                        <select onChange={this.onChangeStatusFilter}>
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Training">Training</option>
                            <option value="Bench">Bench</option>
                        </select>&nbsp;&nbsp;
                        <label>Pending Trainees:</label> &nbsp;
                        <input type="checkbox" value="Pending" onClick={this.onChangePendingFilter}/> &nbsp;&nbsp;
                        <button className="resetBtn" onClick={this.toggle}>Select Start Dates</button> &nbsp;&nbsp;
                    </p>
                    </Collapse>
                    <br/>

                </div>
                <ReactTable
                    data={trainees}
                    showPagination={false}
                    pageSize={(trainees.length > 5) ? trainees.length : 5}
                    columns={[
                        {
                        Header: () => <div><strong>Name</strong></div>,
                        accessor: "name",
                        show: true
                        },
                        {
                        Header: () => <div><strong>Email</strong></div>,
                        accessor: "email",
                        Cell: row =>(<div id="email"><a href={"mailto:"+row.value}>{row.value}</a></div>)
                        },
                        {
                        Header: () => <div><strong>Start Date</strong></div>,
                        accessor: "displayStart",
                        },
                        {
                        Header: () => <div><strong>Recruited By</strong></div>,
                        accessor: "recruitedBy",
                        },
                        {
                        Header: <div><strong>Trainee Status</strong></div>,
                        accessor: "status",
                        },
                        {
                        Header: () => <div><strong>Days payable</strong></div>,
                        accessor: "days",
                        Footer: () => {    
                            let total = 0
                            trainees.map(t => {
                                total += parseInt(t.days)
                            })
                            return 'Total: ' + total}
                        },
                        {
                        Header: () => <div><strong>Bursary this month</strong></div>,
                        accessor: "bursary",
                        Cell: row =>(<span>£{row.row.bursary.amountMonth}</span>),
                        width: 200,
                        Footer: () => {    
                            let total = 0
                            trainees.map(t => {
                                total += t.bursary.amountMonth
                            })
                            return 'Total: £' + total}
                        },
                        {
                        Header: () => <div><strong>Expenses</strong></div>,
                        accessor: "expenses",
                        Cell: row =>(<div>£{row.value}</div>),
                        Footer: () => {    
                            let total = 0
                            trainees.map(t => {
                                total += parseInt(t.expenses)
                            })
                            return 'Total: £' + total}
                        },
                        {
                        Header: () => <div><strong>Payment this month</strong></div>,
                        accessor: "totalMonth",
                        Cell: row =>(<div>£{row.value}</div>),
                        Footer: () => {    
                            let total = 0
                            trainees.map(t => {
                                total += t.totalMonth
                            })
                            return 'Total: £' + total}
                        }
                        
                    ]}
                    style={{
                      height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
                    }}
                    className="-striped -highlight"
                    />
                </div>
                </Collapse>
                </div>
                </div>
            );
        }
	}
}