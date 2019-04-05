import React from 'react';
import renderer from 'react-test-renderer';
import TraineeDetails from "../src/components/trainee-details.component";
import axios from "axios";
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";

it(" the component has been rendered successfully onto the app", () => {
	const traineeDetails = renderer.create(<TraineeDetails/>);
});
jest.mock("axios");
	
it('returns data when component is loaded', async () => {		
		
		const trainee = {	
		data: [{
			_id:"5ca47992fe60fb0cc416d0a4", 
			trainee_fname:"Alex", 
			trainee_lname:"Cross", 
			trainee_email: "alexCross@aol.co.uk"}]
		};
		const res = { data : trainee };
		axios.get.mockImplementation(() => 
			promise.resolve(res));
		
});