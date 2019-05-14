import React from 'react';
import renderer from 'react-test-renderer';
import PasswordStaff from "../src/components/change-password-staff.component";
import axios from "axios";
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";


describe('Change Staff Password',()=> {
	
	it('change password component was rendered',() => {
		const passwordStaff = renderer.create(<PasswordStaff />) 
	});

});

