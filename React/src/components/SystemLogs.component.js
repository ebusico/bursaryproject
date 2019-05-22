import React, { Component } from 'react';
import fileReader from 'react-file-reader'; 
import { render } from 'react-dom';

import logs from './helper/server_logs.txt';
import { authService } from './modules/authService';
import AccessDenied from './modules/AccessDenied';
import '../css/system_logs.css';

export default class SystemLogs extends Component {
	constructor(props) {
				super(props);
					
				this.state = {
					logs:logs,
					currentUser: authService.currentUserValue,
					};
			}
			
		download (){
		/*
			var FileSaver = require('file-saver');
			const response = {
				file: './helper/server_logs.txt'
			};
			var blob = new Blob([response.file], {type: "text/plain;charset=utf-8"});
			FileSaver.saveAs(blob, "server_logs.txt");
			
			<button  className='system_btn' onClick={this.download}>Download Logs</button>
		
			window.open(response.file);
			*/
		}
		
	render() {
		if(this.state.currentUser.token.role === 'admin'){
			return(
			<div className="system_wrapper">
				<div className="system_body">
					<iframe id="serverLogs" src={this.state.logs} frameBorder="0"/>
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