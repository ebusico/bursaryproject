import React from 'react';
import renderer from 'react-test-renderer';
import ChangePassword from "../src/components/change-password-trainee.component";
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

describe('change password trainee',() => {
	it('change password component was rendered',() => {
		const changePassword = renderer.create(<ChangePassword />) 
		});
	it('should respond to change event for password', () => {
		const onChange = jest.fn();
		const wrapper = mount(<input id='cdPassword' type="password" name="trainee_password"
                               className="form-control"
                               onChange={onChange}
                        />)
		wrapper.find('input').simulate('change', {target: {name:'trainee_password', value:'password'}});
	})
})

