import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Trainee = props => (
    <tr>
        <td>{props.trainee.trainee_fname}</td>
        <td>{props.trainee.trainee_lname}</td>
        <td>{props.trainee.trainee_email}</td>
    </tr>
)

export default class ListTrainee extends Component {
    
    constructor(props) {
        super(props);
                
        this.state = {trainees: []};
    }
    
    componentDidMount() {
        axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/')
            .then(response => {
                this.setState({ trainees: response.data });
            })
            .catch(function (error){
                console.log(error);
            })
    }
    
    traineeList() {
        return this.state.trainees.map(function(currentTrainee, i){
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