import React from 'react';
import CreateTrainee from "../src/components/create-trainee.component";
import renderer from 'react-test-renderer';

it('the navbar is rendered onto the app', () => {
    const createTrainee = renderer.create(<CreateTrainee/>);
  });
  