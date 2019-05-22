import React, { Component } from 'react';
import { LazyLog } from 'react-lazylog';
import { render } from 'react-dom';
import { authService } from './modules/authService';
import '../css/system_logs.css';

export default class SystemLogs extends Component {
	constructor(props) {
				super(props);
					
				this.state = {
					currentUser: authService.currentUserValue,
					};
			}
	render() {
	
		return(
			<div className="system_wrapper">
			<h5> hello server</h5>
				<div id="systemBodyLogs" className="system_body">
					<p><serverLogs /></p>
				</div>
			</div>
			
			)
		}
			
}