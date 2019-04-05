import React from 'react';
import ListTrainee from "../src/components/list-trainee.component";
import renderer from 'react-test-renderer';
import axios from 'axios';
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";

it('the component is rendered onto the app', () => {
	const trainee = {	
	data: [{
			_id:"5ca47992fe60fb0cc416d0a4", 
			trainee_fname:"Alex", 
			trainee_lname:"Cross", 
			trainee_email: "alexCross@aol.co.uk"}]
		};
	const listTrainee = renderer.create(
	<Router>
	<ListTrainee {...trainee}/>
	</Router>);
  });
 
jest.mock("axios");

it('shows trainee data when component is loaded', async () => {		
		
		const trainee = {	
		data: [{
			_id:"5ca47992fe60fb0cc416d0a4", 
			trainee_fname:"Alex", 
			trainee_lname:"Cross", 
			trainee_email: "alexCross@aol.co.uk"}]
		};
		const res = { data : trainee };
		axios.get.mockImplementation(() => promise.resolve(res));
		
});