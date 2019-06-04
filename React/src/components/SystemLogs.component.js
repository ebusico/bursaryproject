import React, { Component } from 'react';
import fileReader from 'react-file-reader'; 
import { render } from 'react-dom';
import {FileSaver, blob, saveAs} from 'file-saver';
import axios from 'axios';
import { authService } from './modules/authService';
import AccessDenied from './modules/AccessDenied';
import '../css/system_logs.css';

export default class SystemLogs extends Component {
	constructor(props) {
				super(props);
					
				this.state = {
					logs:[],
					currentUser: authService.currentUserValue,
					};
			}
			
	async componentDidMount() {
		axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/admin/getServerLogs')
		.then(response => {
			this.setState({
				logs: response.data,
				});
		})
		.catch(function (error){
		console.log(error);
	  })
	  console.log('receieved data: ' + this.state.logs);
	}
	/*
	download(){
		<button  className='system_btn' onClick={this.download}>Download Logs</button>
		var FileSaver = require('file-saver');
		axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/admin/getServerLogs')
		.then(response => {
			var data = new blob([data], {
				type: "text"
				});
			FileSaver.saveAs(data, "sample-file.log");
		})
		.catch(function (error){
		console.log(error);
	  })
	}
	*/
	render() {
		if(this.state.currentUser.token.role === 'admin'){
			return(
			<div className="system_wrapper">
				<div className="system_body">
				</div>
					<div id ="sample" className="system_body_logs">
					{this.state.logs.map(log => {return( <div>{log}</div>)})}
					
				</div>
			</div>
			)
		}else{
			return (
				<AccessDenied/>
			);
		
		}
	}
}