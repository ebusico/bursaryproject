import React from 'react';
import TabList from "../src/components/tab-list.component";
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure  } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import MockAdapter from 'axios-mock-adapter';
import axios from "axios";

import regeneratorRuntime from "regenerator-runtime";
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";

configure({adapter: new Adapter()});

describe('Tab-List Component', () => {
	
	it("should render the TabList component", () => {
		const instance = renderer.create(<Router><TabList/></Router>); 
	})
	
	it('returns result of true for trainee list', async() => {
        var mock = new MockAdapter(axios);
		const wrapper = shallow(<TabList/>);
        const data = {result: true, trainee_email: 'Qatesting@qa.com', trainee_fname:'john',trainee_lname:'Doe'};
        mock.onGet('http://localhost:4000/trainee/').reply(data);
    }, 1000);
});
let props = {};

describe('Tab-List props', () => {
	beforeEach(() => {
		props = {
			trainees: [
			{'trainee_fname':'John', 'trainee_lname':'Smith', 'trainee_email':'JohnSmith@testing.com'},
			{'trainee_fname':'Alex', 'trainee_lname':'Doe', 'trainee_email':'AlexDoe@testing.com'}
			]
		};
	});
	
	it('should mount props', () => {
		const propInstance = mount(<Router><TabList{...props}/></Router>);	
	});
});