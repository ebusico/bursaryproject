import React from 'react';
import ReactDOM from 'react-dom';
import App from '../src/App';
import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const app = renderer.create(<App/>)
});
