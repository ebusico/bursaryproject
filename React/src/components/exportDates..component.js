import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import '../css/list-trainee-recruiter.css';
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import moment from 'moment';

import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

export default class ListTrainee extends Component {
    
    constructor(props) {
        super(props);
			
        this.state = {
			trainees: [], 
            selectedDays: [],
            splitDays:[],
            currentUser: authService.currentUserValue,
            csv: '',
            modal: false
			};
        
       //Added onChangeSearch - Ernie
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.toggle = this.toggle.bind(this);
    }
    
    componentDidMount() {
        axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/')
            .then(response => {
                var encrypted = response.data;
                encrypted.map(function(currentTrainee, i){
                    var bytes  = CryptoJS.AES.decrypt(currentTrainee.trainee_email, codes.staff, {iv: codes.iv});
                    currentTrainee.trainee_email = bytes.toString(CryptoJS.enc.Utf8);
                    bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_fname, codes.trainee);
                    currentTrainee.trainee_fname = bytes.toString(CryptoJS.enc.Utf8);
                    bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_lname, codes.trainee);
                    currentTrainee.trainee_lname = bytes.toString(CryptoJS.enc.Utf8);

                    bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_start_date, codes.trainee);
                    currentTrainee.trainee_start_date = bytes.toString(CryptoJS.enc.Utf8);
                    bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_end_date, codes.trainee);
                    currentTrainee.trainee_end_date = bytes.toString((CryptoJS.enc.Utf8));
                    
                    if(currentTrainee.trainee_bank_name != undefined && currentTrainee.trainee_account_no != undefined && currentTrainee.trainee_sort_code != undefined){
                        console.log(currentTrainee.trainee_fname);
                        bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_bank_name, codes.trainee);
                        currentTrainee.trainee_bank_name = bytes.toString(CryptoJS.enc.Utf8);
                        bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_account_no, codes.trainee);
                        currentTrainee.trainee_account_no = bytes.toString(CryptoJS.enc.Utf8);
                        bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_sort_code, codes.trainee);
                        currentTrainee.trainee_sort_code = bytes.toString(CryptoJS.enc.Utf8);
                    }
                });
                this.setState({trainees: encrypted});
            })
            .catch(function (error){
                console.log(error);
            })
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
	
    render() {
        //Declared variables in order to read input from search function
        let trainees = this.state.trainees;
        let search = this.state.selectedDays;
        let splitDays = this.state.splitDays;
        let output = this.state.csv;
        let role = this.state.currentUser.token.role
        if(role === 'finance'){
            output = [["First Name", "Last Name", "Email", "Bank Name", "Account Number", "Sort Number","Start-Date", "End-Date"]];
            trainees.map( t => {
                    var obj = [t.trainee_fname, t.trainee_lname, t.trainee_email, t.trainee_bank_name, t.trainee_account_no, t.trainee_sort_code, moment(t.trainee_start_date).format('MMMM Do YYYY'), moment(t.trainee_end_date).format('MMMM Do YYYY')];
                    output.push(obj);
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
        if(this.state.currentUser.token.role === 'finance' || this.state.currentUser.token.role === 'admin'){
        return (
            <div className="QAtable">
                <div className="QASearchBar">
                    {/* <DatePicker
                        selected={this.state.selectedDate}
                        onChange={this.onChangeSearch}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Specify Start Date to filter"
                        strictParsing
                        disabledKeyboardNavigation
                    /> */}
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} className="dateModal">
                        <ModalHeader toggle={this.toggle} cssModule={{'modal-title':'w-100 text-center'}}>Select Start Dates</ModalHeader>
                        <ModalBody cssModule={{'modal-body':'w-100 text-center'}}>
                            <DayPicker
                                selectedDays={this.state.selectedDays}
                                onDayClick={this.handleDayClick}
                            />
                        </ModalBody>
                    </Modal>
                    <div id="addUser">
                        <button className="qabtn" onClick={this.toggle}>Select Dates</button>
                        <button className="qabtn"><CSVLink className="link" data={output} filename='CSV-Report.csv'>Download CSV </CSVLink></button>
                    </div>
                </div>

                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Start Date</th>
                        </tr>
                    </thead>               
                    <tbody>
                        {trainees.map(t => {
                            return (
                                <tr>
                                    <td> {t.trainee_fname}</td>
                                    <td> {t.trainee_lname}</td>
                                    <td> {t.trainee_email}</td>
                                    <td> {moment(t.trainee_start_date).format('MMMM Do YYYY')}</td>
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
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