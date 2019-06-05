import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import Collapse from 'react-bootstrap/Collapse'
import '../css/list-trainee-recruiter.css';

export default class ListTrainee extends Component {
    
    constructor(props) {
        super(props);
			
        this.state = {
			trainees: [], 
			searchString: "",
            currentUser: authService.currentUserValue,
            recruiterName: '',
            filter: {
                myTrainees: false,
                status: 'All',
                bursary: 'All',
            },
            open: false
			};
        
       //Added onChangeSearch - Ernie
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.onChangeStatusFilter = this.onChangeStatusFilter.bind(this);
        this.onChangeBursaryFilter = this.onChangeBursaryFilter.bind(this);
        this.onChangeMyTraineeFilter = this.onChangeMyTraineeFilter.bind(this);
    }
    
    componentDidMount() {
        axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/')
            .then(response => {
                this.setState({trainees: response.data});
            })
            .catch(function (error){
                console.log(error); 
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
                  recruiterName: response.data.fname + " "+ response.data.lname
                })
              }
            });
    }

    // Added onChangeSearch(e) function. Needed for the search filter
    onChangeSearch(e) {
        this.setState({
            searchString: e.target.value
        });
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
        var newFilter = this.state.filter
        newFilter.status = newVal
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
	
    render() {
        //Declared variables in order to read input from search function
        let trainees = this.state.trainees;
        let search = this.state.searchString.trim().toLowerCase().replace(/\s+/g, '');
        let filter = this.state.filter;
        let recruiterName = this.state.recruiterName;
        let deleteToggle = '';
        const {open} = this.state;

        
        if(search.length > 0){
            trainees = trainees.filter(function(i){
                if(i.trainee_fname.toLowerCase().match(search) ||
                   i.status.toLowerCase().match(search)        ||
                   i.added_By.toLowerCase().match(search)      ||
                   i.bursary.toLowerCase().match(search)       ||
                   i.trainee_lname.toLowerCase().match(search) ||
                   i.trainee_email.toLowerCase().match(search) ||
                   (i.trainee_fname.toLowerCase() + i.trainee_lname.toLowerCase() + i.trainee_email.toLowerCase()).match(search)){
                    return i;
                }
            })
        }
        if(filter.status != 'All'){
            trainees = trainees.filter(function(trainee){
                if(trainee.status == filter.status){
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

		if (this.state.currentUser.token.role === undefined){
			return (
			<AccessDenied/>
			)
		}
		else if(this.state.currentUser.token.role === 'recruiter'){
			return (
            <div className="bigBox">
            <div className="QAtable">
                <div className="QASearchBar">
                    <input
                        type="text"
                        value={this.state.searchString}
                        onChange={this.onChangeSearch}
                        placeholder="Find trainee..."
                    />
                    <button
                    onClick={() => this.setState({ open: !open })}
                    aria-controls="example-collapse-text"
                    aria-expanded={open}
                    className="filter-btn"
                    >
                    Filters
                    </button>
                    <div id="addUser">
                        <button className="qabtn"><Link className="link" to={"/create"}>Add Trainee</Link></button>
                        <button className="qabtn"><Link className="link" to={"/settings"}>Trainee Settings</Link></button>
                    </div>
                    <Collapse in={this.state.open}>
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
                    </p>
                    </Collapse>
                </div>

                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Recruited By</th>
                            <th>Bursary</th>
                            <th>Action</th>
                        </tr>
                    </thead>               
                    <tbody>
                        {trainees.map(t => {
                            if(t.status != "Suspended"){
                                return (
                                    <tr>
                                        <td> {t.trainee_fname}</td>
                                        <td> {t.trainee_lname}</td>
                                        <td> {t.trainee_email}</td>
                                        <td> {t.status}</td>
                                        <td> {t.added_By}</td>
                                        <td> {t.bursary}</td>
                                        <td> <button onClick={() => window.location.href="/editDates/"+t._id}> Edit </button> &nbsp;
                                        <button onClick={() => { 
                                                            if (window.confirm('Are you sure you wish to delete this trainee?'))
                                                            axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/delete/'+t._id).then(() => window.location.reload()) } }>
                                                            Delete
                                        </button>
                                        </td>
                                    </tr>
                                );
                            }
                        })}
                    </tbody>

                </table>
            </div>
            </div>
        );
			
		}
	}
}