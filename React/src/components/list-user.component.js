import React, { Component } from 'react';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";
import { authService } from './modules/authService';
import { Link } from 'react-router-dom'
import AccessDenied from './modules/AccessDenied';
import '../css/list-trainee.css';


export default class ListUser extends Component {
    
    constructor(props) {
			//redirects to login if not logged in
	if (!authService.currentUserValue){
			document.location.href = 'http://'+process.env.REACT_APP_AWS_IP+':3000/login';
			//this.context.history.push('/login');
		}
        super(props);
		
        this.state = {
			users: [], 
			searchString:"",
			currentUser: authService.currentUserValue
			};
        this.onChangeSearch = this.onChangeSearch.bind(this);
    }
	
    
    componentDidMount() {
        axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/admin/')
            .then(response => {
			if(this.state.currentUser.token.role === 'admin'){
                var encrypted = response.data;
                encrypted.map(function(currentUser, i){
                    var email = CryptoJS.AES.decrypt(currentUser.email, codes.staff ,{iv: codes.iv});
                    var status = CryptoJS.AES.decrypt(currentUser.status, codes.staff ,{iv: codes.iv});
                    currentUser.email = email.toString(CryptoJS.enc.Utf8);
                    currentUser.status = status.toString(CryptoJS.enc.Utf8);;
                });
                this.setState({users: encrypted});
            }
			})
            .catch(function (error){
                console.log(error);
            })
		}

    onChangeSearch(e) {
        this.setState({
            searchString: e.target.value
        })
    }

    
    render() {
        let users = this.state.users;
        let search = this.state.searchString.trim().toLowerCase();

        if(search.length > 0){
            users = users.filter(function(i){
                if(i.email.toLowerCase().match(search) || i.role.toLowerCase().match(search)){
                    return i;
                }
            })
        }
	   if(this.state.currentUser.token.role !== 'admin'){
		   return (
		   < AccessDenied />
	   );} else{
        return (
            <div className="QAtable">
                <div className="QASearchBar">
                    <input
                        type="text"
                        value={this.state.searchString}
                        onChange={this.onChangeSearch}
                        placeholder="Find User.." 
                    />
                    <div id="addUser">
                        <button className="qabtn"><Link className="link" to ={"/addUser"}>Add User</Link></button>
                    </div>
                </div>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th className="action">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => {
                            let deleteToggle = '';
                            let deleteRoute = '';  
                            if(user.status === "Suspended"){
                                deleteToggle = "Reactivate";
                                deleteRoute = "reactivate";
                            }
                            else{
                                deleteToggle = "Suspend";
                                deleteRoute = "delete";
                            }                          
                            return (
                                <tr>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.status}</td>
                                <td>
                                    <button onClick={() => { 
                                                    if (window.confirm('Are you sure you wish to '+deleteToggle.toLowerCase()+' this user?'))
                                                    axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/admin/'+deleteRoute+'/'+user._id).then(() => window.location.reload()) } }>
                                                    {deleteToggle}
                                    </button>
                                </td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
	   }
    }
}