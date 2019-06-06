import React from "react";
import { authService } from './modules/authService';
import { slide as Menu } from "react-burger-menu";


export default class sideBar extends React.Component {
	constructor(props) {
        super(props);
			this.state = {
				show_server_logs: false,
				currentUser: authService.currentUserValue
		}
	}
	componentDidMount(){
		if(this.state.currentUser.token.role === 'admin'){
			this.setState({
				show_server_logs: true,
			})
		}else{
			this.setState({
				show_server_logs: false
			})
		}
	}
	 showSettings (event) {
		event.preventDefault();
		}
   render () {
	const {show_server_logs} = this.state;
	
	return (
		// Pass on our props
		<Menu>
			<a className="sidebar_btn" onClick={() => { document.location.href = "/"; }}>Home</a>
			<a id="HelperGuide" target="_new" className="menu-item" href="https://docs.google.com/document/d/1AXQ9NMtyfb5IkY0sDhafANRjIISliqCThlpj8kq99LA/edit">User Guide</a>
			{show_server_logs ? 
				<a className="sidebar_btn" onClick={() => { document.location.href = "/system_logs"; }}>
				System Logs
				</a>
				: ""}
			<a className="sidebar_btn" onClick={() => { document.location.href = "/settings"; }}>Universal Settings</a>
		</Menu>
		);
	};
};