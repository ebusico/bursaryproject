import React from 'react';
var ListTrainee = require("../src/components/list-trainee.component").default;
import renderer from 'react-test-renderer';
import axios from 'axios';

import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";

jest.mock("axios");

describe ('show trainee list', () => {
	it('the component is rendered onto the app', () => {
			const spy = jest.spyOn(axios, 'get');
			const instance = renderer.create(<ListTrainee/>); 
			expect(spy).toBeCalled();
	});
 });

