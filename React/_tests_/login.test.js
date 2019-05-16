import React from 'react';
import Login from "../src/components/login.component.js";
import renderer from 'react-test-renderer';
import TestUtils from 'react-dom/test-utils';
import axios from "axios";

import { shallow, mount, render, configure  } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockAdapter from 'axios-mock-adapter';

import regeneratorRuntime from "regenerator-runtime";
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";

configure({
	adapter: new Adapter(),
	disableLifecycleMethods: true
	});


describe('Login Component', () => {
	const mockValues = {
		email: 'recruiter@mail.com',
		psw: 'password',
		onSubmit: jest.fn(),
	};
	it("should render the login component", () => {
		const instance = renderer.create(<Login/>); 
	})
	it(" should show the login form", () => {
		var rendered = TestUtils.renderIntoDocument(<Login/>);
		var form = TestUtils.findRenderedDOMComponentWithTag(rendered, 'form');
		TestUtils.Simulate.submit(form, {uname:"recruiter@mail.com", psw:"password"});
	});
	
	it('should call the onSubmit funtion when clicked on', () => {
      const callback = jest.fn();
	  const wrapper = shallow(<Login/>);
	  	
	  wrapper.find('#password').simulate('change', {target: {name:'psw', value:'password'}})
	  wrapper.find('#email').simulate('change', {target: {name:'email', value:'recruiter@mail.com'}})

	  wrapper.instance().onSubmit({ preventDefault: () => {} });
    });
	
	it('returns result of false along with email when called with wrong details', async() => {
        var mock = new MockAdapter(axios);
		const wrapper = shallow(<Login/>);
        const data = {result: false, email: 'Qatesting@qa.com', psw:'password'};
        mock.onPost('http://localhost:4000/trainee/login').reply(data);
    }, 1000);
	
	
	
	it('returns result of true along with email when called with correct details', async() => {
        var mock = new MockAdapter(axios);
        const data = {result: true, email: 'recruiter@gmail.com', psw:'password'};
        mock.onGet('http://localhost:4000/trainee/login').reply(data);
    }, 1000);
	
	it('should respond to change event for email', () => {
		const wrapper = shallow(<Login/>)
		wrapper.find('#email').simulate('change', {target: {name:'email', value:'recruiter@mail.com'}})
		expect(wrapper.state('email')).toEqual('recruiter@mail.com')
	})
	
	it('should respond to change event for password', () => {
		const wrapper = shallow(<Login/>)
		wrapper.find('#password').simulate('change', {target: {name:'psw', value:'password'}})
		expect(wrapper.state('psw')).toEqual('password')
	})
	
	
})

