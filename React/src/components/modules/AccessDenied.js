import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'


export default class AccessDenied extends Component {

componentDidMount(){
	alert('Access Denied');
	document.location.href = 'http://localhost:3000/';
}
render() {
        return (
		<div id="access-denied-error">
		</div>
		);
	}
}