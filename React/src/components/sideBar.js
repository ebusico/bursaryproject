import React from "react";
import { slide as Menu } from "react-burger-menu";
import pdf_example1 from './helper/example_1.pdf';

export default class sideBar extends React.Component {
	 showSettings (event) {
    event.preventDefault();
  }
   render () {
  return (
    // Pass on our props
     <Menu>
	 <h1>Help Guide</h1>
        <a id="Example pdf 1" target="_new" className="menu-item" href={pdf_example1}>Example 1</a>
      </Menu>
  );
};
};