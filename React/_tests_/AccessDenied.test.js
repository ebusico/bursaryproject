import React from 'react';
import AccessDenied from '../src/components/modules/AccessDenied';
import { authService } from '../src/components/modules/authService';
import renderer from 'react-test-renderer';
import {setupTest} from './setupTest';

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
	
window.alert = jest.fn();

describe('AccessDenied',()=> {
	it('can test', () => {
		const mockWindow = {location: {href: null}};
		jest.fn({window: mockWindow});
	});
	
	it('Should render the components', () => {
		const instance = renderer.create(<AccessDenied />);
		window.alert.mockClear();
	});

});

  
  