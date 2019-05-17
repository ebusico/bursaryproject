import React from 'react';
import ReactDOM from 'react-dom';
import App from '../src/App';
import renderer from 'react-test-renderer';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";
import { shallow, mount, render, configure  } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({
	adapter: new Adapter(),
	disableLifecycleMethods: true
	});

describe ('show trainee list', () => {
	it('renders without crashing', () => { 
		const div = document.createElement('div'); 
		ReactDOM.render(<App />, div); 
		ReactDOM.unmountComponentAtNode(div); 
	});

});