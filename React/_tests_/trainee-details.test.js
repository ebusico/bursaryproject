import React from 'react';
import renderer from 'react-test-renderer';
import TraineeDetails from "../src/components/trainee-details.component";
import AccessDenied from '../src/components/modules/AccessDenied';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import TestHelpers from './test_helpers.js';

import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";
import { shallow, mount, render, configure  } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({
	adapter: new Adapter(),
	disableLifecycleMethods: true
	});

var stubComponent = TestHelpers.stubComponent;

describe('/trainee-details', () => {
	
	it("the component has been rendered successfully onto the app", (done) => {
			const spy = jest.spyOn(TraineeDetails.prototype,'componentDidMount');
			const instance = renderer.create(<TraineeDetails/>);
			expect(spy).toHaveBeenCalled();
			done();
		});
		
	it('should display trainee details', () => {
		const spy = jest.spyOn(axios, 'get');
		const mock = new MockAdapter(axios);
		const instance = shallow(<TraineeDetails/>);
		const _id = '12312'
		mock.onGet('http://localhost:4000/trainee/'+_id).reply(200, {
			data:{
			trainee_fname:'John'
			}
		});
		let response = TraineeDetails;
		
		setTimeout(() => {
			expect(response.trainee_fname[0]).to.be.equal('John');
		}, 0)
	});
		
	it('should setState of trainee information', () => {
		const traineeDetails = shallow(<TraineeDetails/>).instance();
		traineeDetails.prototype.setState = jest.fn();
		this.state ={
			trainee_fname:''
		}
		trainee_fname.setState({ error: true })
		
		expect(traineeDetails.setState).toHaveBeenCalled();
		expect(traineeDetails.find('#detailstbody').length).toBe(1);
	})
});
