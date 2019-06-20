import React from "react";
import { authService } from './modules/authService';
import "../css/navBar.css";
import { userInfo } from "os";


export default class topNavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPasswordChange: false,
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

        if (this.state.currentUser.token.role === undefined) {
            this.setState({
                showPasswordChange: false,
            })
        } else {
            this.setState({
                showPasswordChange: true,
            })
        }


    }
    showSettings(event) {
        event.preventDefault();
    }


    handlePasswordStaff(e) {
        window.location.href = "update-mypassword-staff/" + e.target.value
    }

    render() {
        const { show_server_logs } = this.state;
        const { showPasswordChange } = this.state;

        return (
            // Pass on our props
            <div id="top-nav-bar">
                <ul>
                    <li><a className="sidebar_btn" onClick={() => { document.location.href = "/"; }}>Home</a></li>
                    <li><a id="HelperGuide" target="_new" className="sidebar_btn" href="https://docs.google.com/document/d/1AXQ9NMtyfb5IkY0sDhafANRjIISliqCThlpj8kq99LA/edit">User Guide</a></li>

                    {showPasswordChange ? <li>
                        <a className="sidebar_btn" onClick={this.handlePasswordStaff}>Change Password </a>
                    </li>
                        : ""}
                </ul>
            </div>
        );
    };
};
