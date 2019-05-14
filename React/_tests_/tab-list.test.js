import React from 'react';
import TabList from "../src/components/tab-list.component";
import renderer from 'react-test-renderer';
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";
import axios from "axios";

describe ("TabList", () => {
	it('should rendered TabList component onto the app', (done) => {
		const tabList = renderer.create(<TabList/>);
		done;
	});
});
  