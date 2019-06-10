import React, { Component } from 'react';
import axios from 'axios';
import { authService } from './modules/authService';
import { Link } from 'react-router-dom'
import AccessDenied from './modules/AccessDenied';
import Collapse from 'react-bootstrap/Collapse'
import '../css/list-trainee.css';
import add from './icons/person-add.svg';
import history from './icons/history.svg';
import close from './icons/close2.svg';
import filterIcon from './icons/filter.svg';
import mail from './icons/envelope.svg';


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
            currentUser: authService.currentUserValue,
            open: false,
            filter: {
                role: 'All',
                suspended: false
            }
        };
            
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.onChangeRoleFilter = this.onChangeRoleFilter.bind(this);
        this.onChangeSuspendedFilter = this.onChangeSuspendedFilter.bind(this);
    }
	
    
    componentDidMount() {
        axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/admin/')
            .then(response => {
                console.log(response.data);
			if(this.state.currentUser.token.role === 'admin'){
                this.setState({users: response.data});
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

    onChangeRoleFilter(e){
        var newVal = e.target.value;
        var newFilter = this.state.filter
        newFilter.role = newVal
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

    handleHistoryClick(e){
        window.location.href="history/"+e.target.value   
    }

    
    render() {
        let users = this.state.users;
        let search = this.state.searchString.trim().toLowerCase();
        let filter = this.state.filter;
        const {open} = this.state;

        if(search.length > 0){
            users = users.filter(function(i){
                if(i.email.toLowerCase().match(search) || i.role.toLowerCase().match(search)){
                    return i;
                }
            })
        }

        if(filter.role !== 'All'){
            users = users.filter(function(user){
                if(user.role === filter.role.toLowerCase()){
                    return user;
                }

            })
        }

        if(filter.suspended === false){
            users = users.filter(function(user){
                if(user.status !== 'Suspended'){
                    return user;
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
                    <button
                    onClick={() => this.setState({ open: !open })}
                    aria-controls="example-collapse-text"
                    aria-expanded={open}
                    className="filter-btn"
                    >
                    Filters
                    <img src={filterIcon}></img>
                    </button>
                    <div id="addUser">
                        <Link className="link" to ={"/addUser"}><button className="qabtn">Add User<img src={add}></img></button></Link>
                    </div>
                    <Collapse in={this.state.open}>
                    <p>
                        <br></br>
                        <label>Role</label> &nbsp;
                        <select onChange={this.onChangeRoleFilter}>
                            <option value="All">All</option>
                            <option value="Admin">Admin</option>
                            <option value="Recruiter">Recruiter</option>
                            <option value="Finance">Finance</option>
                        </select>&nbsp;&nbsp;
                        <label>Show Suspended</label> &nbsp;
                        <input type="checkbox" value="Suspended" onClick={this.onChangeSuspendedFilter}/> &nbsp;&nbsp;
                    </p>
                    </Collapse>
                </div>
                <div id="resultsTable">
                <table className="table table-hover" style={{ marginTop: 20}} >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th className="action"><center>Action</center></th>
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
                                <td>{user.fname} {user.lname}</td>
                                <td className="userRole">{user.role}</td>
                                <td>{user.status}</td>
                                <td>
                                        <center><button className="actionBtn" onClick={() => { 
                                                    if (window.confirm('Are you sure you wish to '+deleteToggle.toLowerCase()+' this user?'))
                                                    axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/admin/'+deleteRoute+'/'+user._id).then(() => window.location.reload()) } }>
                                                    {deleteToggle}
                                                    <img src={close}></img>
                                    </button>&nbsp;
                                    <button className="actionBtn" value={user._id} onClick={this.handleHistoryClick}>View History <img src={history}></img></button>&nbsp;
                                    <a href={"mailto:"+user.email}><button className="actionBtn">Email <img src={mail}></img></button> </a>
                                    </center>
                                </td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
                </div>
            </div>
        )
	   }
    }
}