import React from 'react';
import Nav from '../src/Nav.js';
import renderer from 'react-test-renderer';

it('the navbar is rendered onto the app', () => {
    const nav = renderer.create(<Nav/>);
  });
  