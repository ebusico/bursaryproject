import React, { Component } from 'react';

import axios from 'axios';
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import '../css/list-trainee-recruiter.css';
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import moment from 'moment';
import Collapse from 'react-bootstrap/Collapse';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import download from './icons/download.svg';
import filterIcon from './icons/filter.svg';



export default class ListTrainee extends Component {
    
    constructor(props) {
        super(props);
			
        this.state = {
			trainees: [], 
            selectedDays: [],
            splitDays:[],
            currentUser: authService.currentUserValue,
            csv: '',
            modal: false,
            filterBoolean: false,
            searchString: "",
            recruiterName: '',
            filter: {
                myTrainees: false,
                status: 'All',
                bursary: 'All',
                suspended: false
            },
            range:{
                from: undefined,
                to: undefined,
            }
			};
        
       //Added onChangeSearch - Ernie
        this.onChangeFilterSearch = this.onChangeFilterSearch.bind(this)
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.toggle = this.toggle.bind(this);
        this.onChangeMyTraineeFilter = this.onChangeMyTraineeFilter.bind(this);
        this.onChangeStatusFilter = this.onChangeStatusFilter.bind(this);
        this.onChangeBursaryFilter = this.onChangeBursaryFilter.bind(this);
        this.onChangeMyTraineeFilter = this.onChangeMyTraineeFilter.bind(this);
        this.handleDaysClicked = this.handleDaysClicked.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
        this.onChangeSuspendedFilter = this.onChangeSuspendedFilter.bind(this);
    }
    
    componentDidMount() {
        axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/')
            .then(response => {
                console.log(response.data);
                this.setState({trainees: response.data});
            })
            .catch(function (error){
                console.log(error);
            });
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
                  recruiterName: response.data.fname + " " + response.data.lname
                })
              }
            });
    }

    // Added onChangeSearch(e) function. Needed for the search filter
    onChangeSearch= (e) =>{
            this.setState({
                searchString: e,
                selectedDate: e
            });
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
        console.log(range);
        this.setState({
            range: range});
        console.log(this.state.range);
      }
    
      onChangeMyTraineeFilter(e){
        var newVal = !this.state.filter.myTrainees
        console.log(newVal)
        var newFilter = this.state.filter
        newFilter.myTrainees = newVal
        this.setState({
            filter : newFilter
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
    
    onChangeSuspendedFilter(e){
        var newVal = !this.state.filter.suspended
        console.log(newVal)
        var newFilter = this.state.filter
        newFilter.suspended = newVal
        this.setState({
            filter : newFilter
        })
    }

    onChangeBursaryFilter(e){
        var newVal = e.target.value;
        var newFilter = this.state.filter
        newFilter.bursary = newVal
        this.setState({
            filter : newFilter
        })
    }

      onChangeFilterSearch(e) {
        this.setState({
            searchString: e.target.value
        });
    }

    handleResetClick() {
        this.setState({
            range: {
                from: undefined,
                to: undefined
            }
        });
      }
	
    render() {
        //Declared variables in order to read input from search function
        let trainees = this.state.trainees;
        let search = this.state.selectedDays;
        let splitDays = this.state.splitDays;
        let output = this.state.csv;
        let role = this.state.currentUser.token.role;
        let searchString = this.state.searchString.trim().toLowerCase().replace(/\s+/g, '');
        let filter = this.state.filter;
        let recruiterName = this.state.recruiterName;
        let range = this.state.range;
        const { from, to } = this.state.range;
        const modifiers = { start: from, end: to };

        if(searchString.length > 0){
            trainees = trainees.filter(function(i){
                if(i.trainee_fname.toLowerCase().match(searchString) ||
                   i.status.toLowerCase().match(searchString)        ||
                   i.added_By.toLowerCase().match(searchString)      ||
                   i.bursary.toLowerCase().match(searchString)       ||
                   i.trainee_lname.toLowerCase().match(searchString) ||
                   i.trainee_email.toLowerCase().match(searchString) ||
                   (i.trainee_fname.toLowerCase() + i.trainee_lname.toLowerCase() + i.trainee_email.toLowerCase()).match(searchString)){
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

        if(filter.bursary != 'All'){
            trainees = trainees.filter(function(trainee){
                if(trainee.bursary == filter.bursary){
                    return trainee;
                }

            })
        }

        if(filter.myTrainees === true){
            trainees = trainees.filter(function(trainee){
                if(trainee.added_By === recruiterName){
                    return trainee;
                }
            })
        }
        if(filter.suspended === false){
            trainees = trainees.filter(function(trainee){
                if(trainee.status !== 'Suspended'){
                    return trainee;
                }
            })
        }

        if(from != undefined){
            if(to == undefined){
                trainees = trainees.filter(function(trainee){
                    let start = new Date(Date.parse(trainee.trainee_start_date));
                    if(DateUtils.isSameDay(start, from)){
                         return trainee;
                    }
                })
            }
            else if(to!= undefined){
                trainees = trainees.filter(function(trainee){
                    let start = new Date(Date.parse(trainee.trainee_start_date));
                    if(DateUtils.isDayInRange(start, range)){
                         return trainee;
                    }
                })
            }
        }

        if(role === 'finance'){
			output = [];
            trainees.map( t => {
                if(t.status === "Active" && t.bursary === "True"){
                    var obj = [t.trainee_sort_code,t.trainee_fname+' '+t.trainee_lname,t.trainee_account_no,t.bursary_amount*t.trainee_days_worked+".00","BURSARY","99"];
                        output.push(obj);
                }    
                }
            )
        }else if(role === 'admin'){
            output = [["First Name", "Last Name", "Email", "Start-Date", "End-Date"]];
            trainees.map( t => {
                    var obj = [t.trainee_fname, t.trainee_lname, t.trainee_email, moment(t.trainee_start_date).format('MMMM Do YYYY'), moment(t.trainee_end_date).format('MMMM Do YYYY')];
                    output.push(obj);
                }
            )
        }
        
        console.log(search.length);
        if(search.length > 0){
            if(role === 'finance'){
                 output = [["First Name", "Last Name", "Email", "Bank Name", "Account Number", "Sort Number","Start-Date", "End-Date"]];
            }
            else if(role === 'admin'){
                 output = [["First Name", "Last Name", "Email", "Start-Date", "End-Date"]];
            }
            console.log(search);
            console.log(this.state.splitDays);
            trainees = trainees.filter(function(i){
                if(splitDays.includes(i.trainee_start_date.split(" ", 4).toString())){
                    if(role === 'finance'){
                        var obj =  [i.trainee_fname, i.trainee_lname, i.trainee_email, i.trainee_bank_name, i.trainee_account_no, i.trainee_sort_code, moment(i.trainee_start_date).format('MMMM Do YYYY'), moment(i.trainee_end_date).format('MMMM Do YYYY')];
                        output.push(obj);
                        console.log(output);
                        return i;
                    } else if(role === 'admin'){
                        var obj =  [i.trainee_fname, i.trainee_lname, i.trainee_email, moment(i.trainee_start_date).format('MMMM Do YYYY'), moment(i.trainee_end_date).format('MMMM Do YYYY')];
                        output.push(obj);
                        console.log(output);
                        return i;
                    }
                }
            })
        }
        if(this.state.currentUser.token.role === 'admin'){
        return (
            <div className="QAtable">
                <div className="QASearchBar">
                    <input
                        type="text"
                        value={this.state.searchString}
                        onChange={this.onChangeFilterSearch}
                        placeholder="Find trainee..."
                    />
                    <button
                    onClick={() => this.setState({ filterBoolean: !this.state.filterBoolean })}
                    aria-controls="example-collapse-text"
                    aria-expanded={this.state.filter}
                    className="filter-btn"
                    >
                    Filters
                    <img src={filterIcon}></img>
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
                    <div id="addUser">
                        <CSVLink className="link" data={output} filename='CSV-Report.csv'><button className="qabtn">Download CSV <img src={download}></img></button></CSVLink>
                    </div>
                    <Collapse in={this.state.filterBoolean}>
                    <p>
                        <br></br>
                        <label>My Trainees</label> &nbsp;
                        <input type="checkbox" value="MyTrainees" onClick={this.onChangeMyTraineeFilter}/> &nbsp;&nbsp;
                        <label>Status</label> &nbsp;
                        <select onChange={this.onChangeStatusFilter}>
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Incomplete">Incomplete</option>
                            <option value="Active">Active</option>
                        </select>&nbsp;&nbsp;
                        <label>Bursary</label> &nbsp;
                        <select onChange={this.onChangeBursaryFilter}>
                            <option>All</option>
                            <option value="True">True</option>
                            <option value="False">False</option>
                        </select>&nbsp;&nbsp;
                        <label>Show Suspended</label> &nbsp;
                        <input type="checkbox" value="Suspended" onClick={this.onChangeSuspendedFilter}/> &nbsp;&nbsp;
                        <button className="resetBtn" onClick={this.toggle}>Select Start Dates</button> &nbsp;&nbsp;
                    </p>
                    </Collapse>
                </div>
                <div id="resultsTable">
                <table className="table table-hover" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th><center>Status</center></th>
                            <th>Recruited By</th>
                            <th><center>Bursary</center></th>
                            <th><center>Start Date</center></th>
                        </tr>
                    </thead>               
                    <tbody>
                        {trainees.map(t => {
                            return (
                                <tr>
                                    <td> {t.trainee_fname}</td>
                                    <td> {t.trainee_lname}</td>
                                    <td id="email"> <a href={"mailto:"+t.trainee_email}>{t.trainee_email}</a></td>
                                    <td> <center>{t.status}</center></td>
                                    <td> {t.added_By}</td>
                                    <td> <center>{t.bursary}</center></td>
                                    <td> <center>{moment(t.trainee_start_date).format('MMMM Do YYYY')}</center></td>
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
                </div>
            </div>
        );
        }
        else if(this.state.currentUser.token.role === 'finance'){
            return (
                <div className="QAtable">
                    <div className="QASearchBar">
                        <input
                            type="text"
                            value={this.state.searchString}
                            onChange={this.onChangeFilterSearch}
                            placeholder="Find trainee..."
                        />
                        <button
                        onClick={() => this.setState({ filterBoolean: !this.state.filterBoolean })}
                        aria-controls="example-collapse-text"
                        aria-expanded={this.state.filter}
                        className="filter-btn"
                        >
                        Filters
                        <img src={filterIcon}></img>
                        </button>
                        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} className="dateModal">
                            <ModalHeader toggle={this.toggle} cssModule={{'modal-title':'w-100 text-center'}}>Select Start Dates</ModalHeader>
                            <ModalBody cssModule={{'modal-body':'w-100 text-center'}}>
                            <p>
                            {from &&
                                to && (
                                <button className="resetBtn" onClick={this.handleResetClick}>
                                    Reset
                                </button>
                                )}
                            </p>
                            <DayPicker
                                className="Selectable"
                                numberOfMonths={this.props.numberOfMonths}
                                selectedDays={[from, { from, to }]}
                                modifiers={modifiers}
                                onDayClick={this.handleDaysClicked}
                            />
                                {/* <DayPicker
                                    selectedDays={this.state.selectedDays}
                                    onDayClick={this.handleDayClick}
                                /> */}
                            </ModalBody>
                        </Modal>
                        <div id="addUser">
                            <button className="qabtn"><CSVLink className="link" data={output} filename='CSV-Report.csv'>Download CSV <img src={download}></img></CSVLink></button>
                        </div>
                        <Collapse in={this.state.filterBoolean}>
                        <p>
                            <br></br>
                            <label>Status</label> &nbsp;
                            <select onChange={this.onChangeStatusFilter}>
                                <option value="All">All</option>
                                <option value="Pending">Pending</option>
                                <option value="Incomplete">Incomplete</option>
                                <option value="Active">Active</option>
                            </select>&nbsp;&nbsp;
                            <label>Bursary</label> &nbsp;
                            <select onChange={this.onChangeBursaryFilter}>
                                <option>All</option>
                                <option value="True">True</option>
                                <option value="False">False</option>
                            </select>&nbsp;&nbsp;
                            <button className="resetBtn" onClick={this.toggle}>Select Start Dates</button> &nbsp;&nbsp;
                        </p>
                        </Collapse>
                    </div>
                    <div id="resultsTable">
                    <table className="table table-hover" style={{ marginTop: 20 }} >
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th><center>Status</center></th>
                                <th>Recruited By</th>
                                <th><center>Bursary</center></th>
                                <th><center>Start Date</center></th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainees.map(t => {
                                return (
                                    <tr>
                                        <td> {t.trainee_fname}</td>
                                        <td> {t.trainee_lname}</td>
                                        <td id="email"> <a href={"mailto:" + t.trainee_email}>{t.trainee_email}</a></td>
                                        <td> <center>{t.status}</center></td>
                                        <td> {t.added_By}</td>
                                        <td> <center>{t.bursary}</center></td>
                                        <td> <center>{moment(t.trainee_start_date).format('MMMM Do YYYY')}</center></td>
                                    </tr>
                                );
                            })}
                        </tbody>
    
                    </table>
                    </div>
                </div>
            );
        }
        else{
			return (
			<AccessDenied/>
			)
        }
	}
}