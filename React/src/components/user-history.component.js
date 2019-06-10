import React, { Component } from 'react';
import axios from 'axios';
import '../css/history.css';
import { authService } from './modules/authService';
import AccessDenied from './modules/AccessDenied';
import moment from 'moment';

export default class UserRecord extends Component {
    
    constructor(props) {
        super(props);
			
        this.state = {
            userType: '',
            recordOf: '',
            record: [],
            currentUser: authService.currentUserValue
			};
        
    }

    componentDidMount() {
        axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/admin/getRecord/'+this.props.match.params.id)
            .then(response => {
                this.setState({record: response.data});
                console.log(this.state.record)
            })
            .catch(function (error){
                console.log(error);
            })
        axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/admin/staff/'+this.props.match.params.id)
             .then(response => {
                if(response.data === null){
                    axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/'+this.props.match.params.id)
                         .then(response =>{
                            if(response.data === null){
                                this.setState({recordOf: 'Not Found', userType: 'User'});
                            }
                            else{
                                this.setState({recordOf: response.data.trainee_email, userType: 'Trainee'});
                            }
                         })
                }
                else{
                    this.setState({recordOf: response.data.email, userType:'Staff'});
                }
            })
            .catch(function (error){
                console.log(error);
            })    
    }

    render(){

		if (this.state.currentUser.token.role !== 'admin'){
			return (
			<AccessDenied/>
			)
        }
        else{
            let record = this.state.record;
            let recordOf = this.state.recordOf;
            let userType = this.state.userType;
            return(
                <div className = "BigBox">
                <div className="historyTable">
                <div className="QASearchBar">
                            <h2>{userType} History- {recordOf}</h2>
                            <h3><center><button id="cancelBtn" onClick={() => { document.location.href = "/"; }}>⭠ Back</button></center></h3>

                        </div>
                        <div>
                            </div>
                <table id="logTable" className="table table-hover" style={{ marginTop: 20}}>
                    <thead>
                        <tr>
                            <th>Date</th>
                                    <th>Event</th>
                        </tr>
                    </thead>               
                    <tbody>
                        {record.map(record => {
                            return (
                                <tr>
                                    <td> {moment(record.timestamp).format('DD/MM/YYYY')}</td>
                                    <td> {record.message} </td>
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            </div>
            </div>
            )
        }
    }
}