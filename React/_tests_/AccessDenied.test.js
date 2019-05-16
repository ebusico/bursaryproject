import React from 'react';
import AccessDenied from '../src/components/modules/AccessDenied';
import { authService } from '../src/components/modules/authService';
import renderer from 'react-test-renderer';
import {setupTest} from './setupTest';

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

  
  