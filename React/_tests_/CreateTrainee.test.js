import React from 'react';
import CreateTrainee from "../src/components/create-trainee.component";
import renderer from 'react-test-renderer';
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";
import axios from "axios";

describe ("createTrainee", () => {
	
it('the component is rendered onto the app', (done) => {
    const createTrainee = renderer.create(<CreateTrainee/>);
	expect(CreateTrainee.prototype.token).toHaveBeenCalled();
  });
});
  