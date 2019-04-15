import React, { Component } from 'react';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";
import TraineeList from "./list-trainee.component";

import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';

const Staff = props => (
    <tr>
        <td>{props.staff.email}</td>
        <td>{props.staff.role}</td>
        <td>
            <button>Delete</button>
        </td>
    </tr>
)

export default class ListUser extends Component {
    
    constructor(props) {
        super(props);
        this.state = {users: []}
    }
    
    componentDidMount() {
        axios.get('http://localhost:4000/admin/')
            .then(response => {
                var encrypted = response.data;
                encrypted.map(function(currentUser, i){
                    var bytes = CryptoJS.AES.decrypt(currentUser.email, codes.staff ,{iv: codes.iv});
                    currentUser.email = bytes.toString(CryptoJS.enc.Utf8);
                });
                this.setState({users: encrypted});
            })
            .catch(function (error){
                console.log(error);
            })
    }

    
    UserList() {
        return this.state.users.map(function(currentUser, i){
            return <Staff staff={currentUser} key={i} />;
        })
    }
    
    render() {
        return (
            <div>
                <h3>User List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.UserList() }
                    </tbody>
                </table>
            </div>
        )
    }
}