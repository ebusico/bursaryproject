import React from 'react';
import EditDates from "../src/components/edit-dates.component";
import renderer from 'react-test-renderer';
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


describe ("EditDates", () => {
	beforeEach(() => {
    jest.setTimeout(10000);
  });
	it('the component is rendered onto the app', async() => {
		const editDates = renderer.create(<EditDates/>);
	});
});
  