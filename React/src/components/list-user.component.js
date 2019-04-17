import React, { Component } from 'react';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";
import { authService } from './modules/authService';
import { BrowserRouter, Link } from 'react-router-dom'
import AccessDenied from './modules/AccessDenied';
import '../css/list-trainee.css';


export default class ListUser extends Component {
    
    constructor(props) {
			//redirects to login if not logged in
	if (!authService.currentUserValue){
			document.location.href = 'http://localhost:3000/login';
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
        axios.get('http://localhost:4000/admin/')
            .then(response => {
			if(this.state.currentUser.token.role === 'admin'){
                var encrypted = response.data;
                encrypted.map(function(currentUser, i){
                    var bytes = CryptoJS.AES.decrypt(currentUser.email, codes.staff ,{iv: codes.iv});
                    currentUser.email = bytes.toString(CryptoJS.enc.Utf8);
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
                            <th className="action">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => {
                            return (
                                <tr>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={()=>axios.get('http://localhost:4000/admin/delete/'+user._id).then((response) => window.location.reload())}>Delete</button>
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