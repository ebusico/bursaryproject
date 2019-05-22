import React, { Component } from 'react';
import fileReader from 'react-file-reader'; 
import { render } from 'react-dom';

import { authService } from './modules/authService';
import '../css/system_logs.css';

export default class SystemLogs extends Component {
	constructor(props) {
				super(props);
					
				this.state = {
					logs:'',
					currentUser: authService.currentUserValue,
					};
					console.log(this.state.logs);
			}
	
	render() {
		return(
			<div className="system_wrapper">
			<h5> hello server</h5>
				<div id="systemBodyLogs" className="system_body">
					<iframe src={this.state.logs} frameBorder="0" height="400" width="50%" />
				</div>
			</div>
			
			)
		}
			
}