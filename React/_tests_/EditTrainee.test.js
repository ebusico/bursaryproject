import React from 'react';
import EditTrainee from "../src/components/edit-trainee.component";
import renderer from 'react-test-renderer';

it('the navbar is rendered onto the app', () => {
    const editTrainee = renderer.create(<EditTrainee/>);
  });
  