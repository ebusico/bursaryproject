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
        <a id="HelperGuide" target="_new" className="menu-item" href="https://docs.google.com/document/d/1AXQ9NMtyfb5IkY0sDhafANRjIISliqCThlpj8kq99LA/edit">User Guide</a>
	    <a id="SystemLogs"  className="menu-item" href="/server_logs">System Logs</a>
	 </Menu>
  );
};
};