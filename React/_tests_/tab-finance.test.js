import React from 'react';
import Tabfinance from "../src/components/tab-finance.component";
import renderer from 'react-test-renderer';
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";
import axios from "axios";

describe ("Tab-finance", () => {
	it('should rendered TabList component onto the app', (done) => {
		const tabfinance = renderer.create(<Tabfinance/>);
		done;
	});
});
  