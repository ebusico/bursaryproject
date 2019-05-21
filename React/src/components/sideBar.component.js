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
        <a id="HelperGuide" target="_new" className="menu-item" href="https://docs.google.com/document/d/1AXQ9NMtyfb5IkY0sDhafANRjIISliqCThlpj8kq99LA/edit">User Guide</a>
	 </Menu>
  );
};
};