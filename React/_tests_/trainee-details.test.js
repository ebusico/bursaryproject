import React from 'react';
import renderer from 'react-test-renderer';
import TraineeDetails from "../src/components/trainee-details.component";
import axios from "axios";
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";

describe('/trainee-details', () => {
it(" the component has been rendered successfully onto the app", (done) => {
			const traineeDetails = renderer.create(<TraineeDetails/>);
			done();
		});
	});

jest.mock("axios");



