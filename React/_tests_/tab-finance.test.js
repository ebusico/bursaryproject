import React from 'react';
import Tabfinance from "../src/components/tab-finance.component";
import renderer from 'react-test-renderer';
import { shallow, mount, render, configure  } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import MockAdapter from 'axios-mock-adapter';
import axios from "axios";

import regeneratorRuntime from "regenerator-runtime";
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";

configure({adapter: new Adapter()});
describe('Tab-finance Component', () => {
	it("should render the login component", () => {
		const instance = renderer.create(<Router><Tabfinance/></Router>); 
	})
	it('returns result of true for trainee list', async() => {
        var mock = new MockAdapter(axios);
		const wrapper = shallow(<Tabfinance/>);
        const data = {result: true, trainee_email: 'Qatesting@qa.com', trainee_fname:'john',trainee_lname:'Doe'};
        mock.onGet('http://localhost:4000/trainee/').reply(data);
    }, 1000);
});

  