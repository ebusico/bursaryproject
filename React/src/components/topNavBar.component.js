import React from "react";
import { authService } from './modules/authService';
import "../css/navBar.css";
import { userInfo } from "os";


export default class topNavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show_server_logs: false,
            currentUser: authService.currentUserValue
        }
    }
    componentDidMount() {
        if (this.state.currentUser.token.role === 'admin') {
            this.setState({
                show_server_logs: true,
            })
        } else {
            this.setState({
                show_server_logs: false
            })
        }
    }
    showSettings(event) {
        event.preventDefault();
    }

    
    handlePasswordStaff(e){
        window.location.href="update-mypassword-staff/"+e.target.value   
    }

    render() {
        const { show_server_logs } = this.state;

        return (
            // Pass on our props
            <div id="top-nav-bar">
            <ul>
                <li><a className="sidebar_btn" onClick={() => { document.location.href = "/"; }}>Home</a></li>
                <li><a id="HelperGuide" target="_new" className="sidebar_btn" href="https://docs.google.com/document/d/1AXQ9NMtyfb5IkY0sDhafANRjIISliqCThlpj8kq99LA/edit">User Guide</a></li>
                <li>
                        <a className="sidebar_btn" onClick={this.handlePasswordStaff}>Change Password </a>
                </li>
                {show_server_logs ?
                    <li><a className="sidebar_btn" value={this.state.currentUser.token._id} onClick={() => { document.location.href = "/system_logs"; }}>
                        System Logs
				</a></li>
             
                    : ""}
                </ul>
            </div>
        );
    };
};
