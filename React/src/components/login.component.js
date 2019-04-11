import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";


export default class Login extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
          uname: '',
          psw: '',
        };
      }

    handleUsername = event => {
        this.setState({
            uname: event.target.value
        });
    }

    handlePassword = event => {
        this.setState({
            psw: event.target.value
        })
    }
    
    onSubmit = event => {
        event.preventDefault();
        CryptoJS.pad.NoPadding = {pad: function(){}, unpad: function(){}};

        var encrypted = CryptoJS.AES.encrypt(this.state.uname, codes.staff, {iv: codes.iv, padding: CryptoJS.pad.NoPadding});
        var pass = CryptoJS.AES.encrypt(this.state.psw, codes.staffPass);
        const user = {
            username: encrypted.toString(),
            password: pass.toString()
        };
        axios.post('http://localhost:4000/trainee/login', user)
            .then(function(res){
                console.log(res.data);
                if(res.data.result === true ){
                    console.log('Successful, now redirecting');
                }
                else{
                    console.log('Unsuccessful Login attempt');
                }
            })
            .catch(error => {
                alert("Invalid Email/Password");
                console.log(error.response)
            });
    }
    
    
    render() {
        return (
            <div className="Login">
                    <form onSubmit={this.onSubmit}>

                        <label className="uname"><b>Email</b></label>
                        <input type="text" placeholder="Enter Email" name="uname" onChange={this.handleUsername} required/>

                        <label className="psw"><b>Password</b></label>
                        <input type="password" placeholder="Enter Password" name="psw" onChange={this.handlePassword} required/>
                        

                        <input type="submit" value="Login"/>
                    </form>
                    
            </div>
        )
    }
}