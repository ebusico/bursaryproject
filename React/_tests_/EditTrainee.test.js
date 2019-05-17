import React from 'react';
import EditTrainee from "../src/components/edit-trainee.component";
import renderer from 'react-test-renderer';
import axios from 'axios';
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";

import { shallow, mount, render, configure  } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';

configure({
	adapter: new Adapter(),
	disableLifecycleMethods: true
	});

  it('can send new start and end dates', async() => {
        var mock = new MockAdapter(axios);
		const wrapper = shallow(<EditTrainee/>);
		
        const data = {
			result: true,
			trainee_fname: 'John',
            trainee_lname: 'Smith',
            trainee_email: 'JohnSmith@aol.com',
			trainee_bank_name:'Bank of Banks',
            trainee_account_no: '123456768',
            trainee_sort_code: '123445'
			};
			
        mock.onPost('http://localhost:4000/trainee/update/'+ '_id').reply(data);
    }, 1000);

it('the component is rendered onto the app', () => {
    const editTrainee = renderer.create(<EditTrainee/>);
  });
  