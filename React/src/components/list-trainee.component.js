import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";

const Trainee = props => (
    <tr>
        <td>{props.trainee.trainee_fname}</td>
        <td>{props.trainee.trainee_lname}</td>
        <td>{props.trainee.trainee_email}</td>
        <td>
            <button onClick={()=>axios.get('http://localhost:4000/trainee/delete/'+props.trainee._id).then((response) => window.location.reload())}>Delete</button>
        </td>
    </tr>
)

export default class ListTrainee extends Component {
    
    constructor(props) {
        super(props);
                
        this.state = {trainees: []};
    }
    
    componentDidMount() {
        axios.get('http://localhost:4000/trainee/')
            .then(response => {
                this.setState({ trainees: response.data });
            })
            .catch(function (error){
                console.log(error);
            })
    }
    
    traineeList() {
        return this.state.trainees.map(function(currentTrainee, i){
            var bytes  = CryptoJS.AES.decrypt(currentTrainee.trainee_email, codes.trainee);
            currentTrainee.trainee_email = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_fname, codes.trainee);
            currentTrainee.trainee_fname = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_lname, codes.trainee);
            currentTrainee.trainee_lname = bytes.toString(CryptoJS.enc.Utf8);
            return <Trainee trainee={currentTrainee} key={i} />;
        })
    }
    
    render() {
        return (
            <div>
                <h3>Trainees List</h3>
                <Link to={"/create"}>Add Trainee</Link>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.traineeList() }
                    </tbody>
                </table>
            </div>
        )
    }
}