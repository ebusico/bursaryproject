import React from 'react';
import renderer from 'react-test-renderer';
import PasswordStaff from "../src/components/change-password-staff.component";
import axios from "axios";
import 'babel-polyfill';

import { shallow, mount, render, configure  } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockAdapter from 'axios-mock-adapter';
import regeneratorRuntime from "regenerator-runtime";
import {BrowserRouter as Router, Route} from "react-router-dom";

configure({
	adapter: new Adapter(),
	disableLifecycleMethods: true
	});
	
describe('Change Staff Password',()=> {
	
	it('change password component was rendered',() => {
		const passwordStaff = renderer.create(<PasswordStaff />) 
	});

});

