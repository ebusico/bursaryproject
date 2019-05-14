import React from 'react';
import EditDates from "../src/components/edit-dates.component";
import renderer from 'react-test-renderer';
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";
import axios from "axios";

describe ("EditDates", () => {
	beforeEach(() => {
    jest.setTimeout(10000);
  });
	it('the component is rendered onto the app', async() => {
		const editDates = renderer.create(<EditDates/>);
	});
});
  