import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import '../css/list-trainee-recruiter.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";

export default class ListTrainee extends Component {
    
    constructor(props) {
        super(props);
			
        this.state = {
			trainees: [], 
			searchString: "",
            currentUser: authService.currentUserValue,
            selectedDate: '',
            csv: [["firstname", "lastname", "email"]]
			};
        
       //Added onChangeSearch - Ernie
        this.onChangeSearch = this.onChangeSearch.bind(this);
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
            searchString: e.toString(),
            selectedDate: e
        });
    }
	
    render() {
        //Declared variables in order to read input from search function
        let trainees = this.state.trainees;
        let search = this.state.searchString;
        let output = this.state.csv;
        console.log(this.state.searchString);
        
        if(search.length > 0){
            trainees = trainees.filter(function(i){
                if(i.trainee_start_date.split(" ", 4).toString() === search.split(" ", 4).toString()){
                    var obj =  [i.trainee_fname, i.trainee_lname, i.trainee_email];
                    output.push(obj);
                    console.log(output);
                    return i;
                }
            })
        }
        if(this.state.currentUser.token.role === 'finance' || this.state.currentUser.token.role === 'admin'){
        return (
            <div className="bigBox">
            <div className="QAtable">

                {/* Add Calender to select start date - onChange = this.onChangeSearch*/}
                <div className="QASearchBar">
                    <DatePicker
                        selected={this.state.selectedDate}
                        onChange={this.onChangeSearch}
                        dateFormat="dd/MM/yyyy"
                        placeholder="Specify Start Date"
                    />
                    <CSVLink data={output} filename='monthly-intake.csv'>Download CSV </CSVLink>
                </div>

                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>               
                    <tbody>
                        {trainees.map(t => {
                            return (
                                <tr>
                                    <td> {t.trainee_fname}</td>
                                    <td> {t.trainee_lname}</td>
                                    <td> {t.trainee_email}</td>
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