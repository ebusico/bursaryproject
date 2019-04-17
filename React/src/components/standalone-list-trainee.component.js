import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import '../css/list-trainee-recruiter.css';

export default class ListTrainee extends Component {
    
    constructor(props) {
        super(props);
			
        this.state = {
			trainees: [], 
			searchString: "",
			currentUser: authService.currentUserValue
			};
        
       //Added onChangeSearch - Ernie
        this.onChangeSearch = this.onChangeSearch.bind(this);
    }
    
    componentDidMount() {
        axios.get('http://localhost:4000/trainee/')
            .then(response => {
                var encrypted = response.data;
                encrypted.map(function(currentTrainee, i){
                    var bytes  = CryptoJS.AES.decrypt(currentTrainee.trainee_email, codes.staff, {iv: codes.iv});
                    currentTrainee.trainee_email = bytes.toString(CryptoJS.enc.Utf8);
                    bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_fname, codes.trainee);
                    currentTrainee.trainee_fname = bytes.toString(CryptoJS.enc.Utf8);
                    bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_lname, codes.trainee);
                    currentTrainee.trainee_lname = bytes.toString(CryptoJS.enc.Utf8);
                });
                this.setState({trainees: encrypted});
            })
            .catch(function (error){
                console.log(error);
            })
    }

    // Added onChangeSearch(e) function. Needed for the search filter
    onChangeSearch(e) {
        this.setState({
            searchString: e.target.value
        });
    }
	
    render() {
        //Declared variables in order to read input from search function
        let trainees = this.state.trainees;
        let search = this.state.searchString.trim().toLowerCase();
        
        if(search.length > 0){
            trainees = trainees.filter(function(i){
                if(i.trainee_fname.toLowerCase().match(search) ||
                   i.trainee_lname.toLowerCase().match(search) ||
                   i.trainee_email.toLowerCase().match(search)){
                    return i;
                }
            })
        }
		if (this.state.currentUser.token.role === undefined){
			return (
			<AccessDenied/>
			)
		}
		else if(this.state.currentUser.token.role === 'recruiter'){
			return (
            <div className="QAtable">
                <div className="QASearchBar">
                    <input
                        type="text"
                        value={this.state.searchString}
                        onChange={this.onChangeSearch}
                        placeholder="Find trainee..."
                    />
                    <div id="addUser">
                        <button className="qabtn"><Link className="link" to={"/create"}>Add Trainee</Link></button>
                    </div>
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
        );
			
		}else{
        return (
            <div className="QAtable">
                <div className="QASearchBar">
                    <input
                        type="text"
                        value={this.state.searchString}
                        onChange={this.onChangeSearch}
                        placeholder="Find trainee..."
                    />
                </div>

                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>               
                    <tbody>
                        {trainees.map(t => {
							if (this.state.currentUser.token.role === 'admin'){
                            return (
                                <tr>
                                    <td> {t.trainee_fname}</td>
                                    <td> {t.trainee_lname}</td>
                                    <td> {t.trainee_email}</td>
                                    <td> 
                                        <button onClick={()=>axios.get('http://localhost:4000/trainee/delete/'+t._id).then((response) => window.location.reload())}>Delete</button>
								   </td>
                                </tr>
                            );
							}
							else if(this.state.currentUser.token.role === 'finance'){
							return (
                                <tr>
                                    <td> {t.trainee_fname}</td>
                                    <td> {t.trainee_lname}</td>
                                    <td> {t.trainee_email}</td>
                                    <td> 
										<button onClick={()=>window.location.href="/trainee-details/"+t._id}> View Details </button>
                                    </td>
                                </tr>
                            );
							}
                        })}
                    </tbody>

                </table>
            </div>
        );
		}
	}
}