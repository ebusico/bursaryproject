import React from 'react';
import EditDates from "../src/components/edit-dates.component";
import renderer from 'react-test-renderer';
import axios from "axios";

import { shallow, mount, render, configure  } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';

import regeneratorRuntime from "regenerator-runtime";
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";

configure({
	adapter: new Adapter(),
	disableLifecycleMethods: true
	});


describe ("EditDates", () => {
	beforeEach(() => {
    jest.setTimeout(10000);
  });
  
  it('can send new start and end dates', async() => {
        var mock = new MockAdapter(axios);
		const wrapper = shallow(<EditDates/>);
        const data = {result: true, trainee_start_date: 'June 1st 2019', trainee_end_date:'June 5th 2019'};
        mock.onPost('http://localhost:4000/trainee/editDates/').reply(data);
    }, 1000);
	
	it('the date is picked', () => {
	 const onchange =jest.fn(),
		props = {
			value: '20.05.2019',
			onchange
		},
		DateInput = mount (<EditDates {...props}/>).find('input');
		DateInput.simulate('change', {target: {value: moment('2019-06-22')}});
		expect (onChange).toHaveBeenCalledWith('22.06.2019');
		});
		
		it('should set state', () => {
		const wrapper = shallow(<EditDates />);
		expect(wrapper.find('#bursaryDates')).to.have.lengthOf(2);
		wrapper.setState({ trainee_start_date: 'May 1st 2019' });
	});
  
	it('the component is rendered onto the app', async() => {
		const editDates = renderer.create(<EditDates/>);
	});
});
  