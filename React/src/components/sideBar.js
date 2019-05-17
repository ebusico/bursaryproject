import React from "react";
import { slide as Menu } from "react-burger-menu";

export default class sideBar extends React.Component {
	 showSettings (event) {
    event.preventDefault();
  }
   render () {
  return (
    // Pass on our props
     <Menu>
	 <h1>Help Guide</h1>
        <a id="home" className="menu-item" href="/">Home</a>
        
      </Menu>
  );
};
};