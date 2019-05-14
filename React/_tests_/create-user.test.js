import React from 'react';
import CreateStaff from "../src/components/create-user.component";
import renderer from 'react-test-renderer';
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";
import axios from "axios";

describe ("createStaff", () => {
	beforeEach(() => {
    jest.setTimeout(10000);
  });
	it('the component is rendered onto the app', async() => {
		const createStaff = renderer.create(<CreateStaff/>);
	});
});
  