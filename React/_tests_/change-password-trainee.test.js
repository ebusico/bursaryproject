import React from 'react';
import renderer from 'react-test-renderer';
import ChangePassword from "../src/components/change-password-trainee.component";
import axios from "axios";
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";

it('change password component was rendered',() => {
const changePassword = renderer.create(<ChangePassword />) 
});

