import React from 'react';
import EditTrainee from "../src/components/edit-trainee.component";
import renderer from 'react-test-renderer';
import axios from 'axios';
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";

it('the component is rendered onto the app', () => {
    const editTrainee = renderer.create(<EditTrainee/>);
  });
  