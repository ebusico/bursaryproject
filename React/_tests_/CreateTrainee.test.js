import React from 'react';
import CreateTrainee from "../src/components/create-trainee.component";
import renderer from 'react-test-renderer';
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";
import axios from "axios";

const token = {
	role: 'admin'
}

it('the component is rendered onto the app', () => {
    const createTrainee = renderer.create(<CreateTrainee/>);
  });
  