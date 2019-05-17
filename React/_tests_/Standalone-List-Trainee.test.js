import React from 'react';
import ListTrainee from '../src/components/standalone-list-trainee.component';
import renderer from 'react-test-renderer';
var assert = require('assert');
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import moxios from 'moxios'
import { equal } from 'assert'
import sinon from 'sinon';

import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";
import { shallow, mount, render, configure  } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({
	adapter: new Adapter(),
	disableLifecycleMethods: true
	});

describe ('show trainee list', () => {
	let axiosInstance;
	
	beforeEach(() => {
		axiosInstance = axios.create();
		moxios.install(axiosInstance);
		
		moxios.stubRequest('http://localhost:4000/trainee/', {
			status: 200,
			response: {
				_id:1,
				trainee_fname:'John', 
				trainee_lname:'Smith', 
				trainee_email:'JohnTest@test.com',
		}
		});
	});
	
	afterEach(() => {
		moxios.uninstall(axiosInstance);
	})
	
	it('should call componentDidMount',() => {
		const wrapper = shallow(<ListTrainee/>);
		sinon.spy(ListTrainee.prototype, 'componentDidMount');
		ListTrainee.prototype.componentDidMount.restore();
	});
	
	it('should axios a thing',(done) =>{
		moxios.stubRequest('http://localhost:4000/trainee/',{
			status:200,
			response:{
				_id:1,
				trainee_fname:'John', 
				trainee_lname:'Smith', 
				trainee_email:'JohnTest@test.com',
		}
		});
		axiosInstance.get('http://localhost:4000/trainee/')
		.then(res => assert(res.status === 200))
		.finally(done);
		});
	
	
	it('the component is rendered onto the app', () => {
			const instance = renderer.create(<Router><ListTrainee/></Router>); 
		});
		
	it('should display trainee list', async () => {
		const spy = jest.spyOn(axios, 'get');
		const mock = new MockAdapter(axios);
		const instance = shallow(<Router><ListTrainee/></Router>);
		const mockData = {
			trainee_email:'JohnDoe@qa.com',
			trainee_fname: 'John', 
			trainee_lname: 'Doe' 			
		}
		mock.onGet('http://localhost:4000/trainee/')
		.reply(404, mockData);
		});
});

