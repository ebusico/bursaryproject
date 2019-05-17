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
			result: true,
			trainee_fname: 'John',
            trainee_lname: 'Smith',
            trainee_email: 'JohnSmith@aol.com',
			trainee_bank_name:'Bank of Banks',
            trainee_account_no: '123456768',
            trainee_sort_code: '123445'
			}
		  });
		let response = TraineeDetails;
		
		setTimeout(() => {
			expect(response.trainee_fname[0]).to.be.equal('John');
		}, 0)
	});
});
