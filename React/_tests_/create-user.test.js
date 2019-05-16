import React from 'react';
import CreateStaff from "../src/components/create-user.component";
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
	
describe ("createStaff", () => {
	beforeEach(() => {
    jest.setTimeout(10000);
  });
	it('the component is rendered onto the app', async() => {
		const createStaff = renderer.create(<CreateStaff/>);
	});
});
  