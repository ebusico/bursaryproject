import React from 'react';
import ListTrainee from "../src/components/list-trainee.component";
import renderer from 'react-test-renderer';

it('the navbar is rendered onto the app', () => {
    const listTrainee = renderer.create(<ListTrainee/>);
  });
  