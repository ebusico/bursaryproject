import React from 'react';
import Login from "../src/components/login.component.js";
import renderer from 'react-test-renderer';
import TestUtils from 'react-dom/test-utils';
import axios from "axios";

import { shallow, mount, render, configure  } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockAdapter from 'axios-mock-adapter';

import regeneratorRuntime from "regenerator-runtime";
import 'babel-polyfill';
import {BrowserRouter as Router, Route} from "react-router-dom";

configure({adapter: new Adapter()});

it('the Login is rendered onto the app', () => {
    const createTrainee = renderer.create(<Login/>);
  });

it("it shows the expected text when clicked", () => {
    var rendered = TestUtils.renderIntoDocument(<Login/>);
    var form = TestUtils.findRenderedDOMComponentWithTag(rendered, 'form');
    TestUtils.Simulate.submit(form, {uname:"recruiter@mail.com", psw:"password"});

});

// it('calls login validation and returns result along with email', () => {
//   //setup
//   Mockaxios.post.mockImplementationOnce(() => Promise.resolve({
//     data: {
//       result: true, email: "recruiter@mail.com"
//     }
//   }));

//   //work


//   //test
//   expect(mockAxios.post).toHaveBeenCalledTimes(1);
// })



describe('Login', () => {
    it('returns result of true along with email when called with correct details', async() => {
        var mock = new MockAdapter(axios);
        const data = {result: true, email: 'recruiter@gmail.com'};
        mock.onPost('http://localhost:4000/trainee/login').reply(data);
    }, 1000);
	
	it('renders a email input', () => {
		expect(shallow(<Login/>).find('#email').length).toEqual(1)
	})
});

describe("handleChangeUsername", () => {
    it("changes the username value of the state", () => {
      const component = renderer.create(<Login />);
      const instance = component.getInstance();
      expect(instance.state.uname).toBe("");
      var form = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'email');
      expect(form[0]).toBe("");
      instance.handleUsername;
      console.log(instance.state);
    });
    /*
	it("it shows the expected text when clicked", () => {
       const component = renderer.create(<Login />);
       const rootInstance = component.root;
       const button = rootInstance.findByType("submit");
       button.props.onClick();
       expect(button.props.children).toBe("PROCEED TO CHECKOUT");
     });
	*/
  });
