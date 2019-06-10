import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import Collapse from 'react-bootstrap/Collapse'
import '../css/list-trainee-recruiter.css';
import add from './icons/person-add.svg';
import close from './icons/close2.svg';
import filterIcon from './icons/filter.svg';
import mail from './icons/envelope.svg';

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
                    <img src={filterIcon}></img>
                    </button>
                    <div id="addUser">
                        <Link className="link" to={"/create"}><button className="qabtn">Add Trainee <img src={add}></img></button></Link>
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
                <div id="resultsTable">
                <table className="table table-hover" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th><center>Status</center></th>
                            <th>Recruited By</th>
                            <th><center>Bursary</center></th>
                            <th><center>Action</center></th>
                        </tr>
                    </thead>               
                    <tbody>
                        {trainees.map(t => {
                            if(t.status != "Suspended"){
                                return (
                                    <tr className="trainees">
                                        <td onClick={() => window.location.href = "/editDates/" + t._id}> {t.trainee_fname}</td>
                                        <td onClick={() => window.location.href = "/editDates/" + t._id}> {t.trainee_lname}</td>
                                        <td onClick={() => window.location.href = "/editDates/" + t._id}> <center>{t.status}</center></td>
                                        <td onClick={() => window.location.href = "/editDates/" + t._id}> {t.added_By}</td>
                                        <td onClick={() => window.location.href = "/editDates/" + t._id}> <center>{t.bursary}</center></td>
                                        <td>
                                        <center><button className="actionBtn" onClick={() => { 
                                                            if (window.confirm('Are you sure you wish to delete this trainee?'))
                                                            axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/delete/'+t._id).then(() => window.location.reload()) } }>
                                                            Delete
                                                            <img src={close}></img>
                                        </button>&nbsp;
                                        <a href={"mailto:"+t.trainee_email}><button className="actionBtn">Email <img src={mail}></img></button> </a>
                                        </center>
                                        </td>
                                    </tr>
                                );
                            }
                        })}
                    </tbody>

                </table>
                </div>
            </div>
            </div>
        );
			
		}
	}
}