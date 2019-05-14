import React from 'react';
import AccessDenied from '../src/components/modules/AccessDenied';
import { authService } from '../src/components/modules/authService';
import renderer from 'react-test-renderer';
import {setupTest} from './setupTest';

describe('AccessDenied',()=> {
	
	it('Should call componentDidMount', () => {
		const instance = renderer.create(<AccessDenied />);
	});

});

  
  