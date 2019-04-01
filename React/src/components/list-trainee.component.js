import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Trainee = props => (
    <tr>
        <td>{props.trainee.trainee_name}</td>
        <td>{props.trainee.trainee_email}</td>
        <td>
            <Link to={"/edit/"+props.trainee._id}>Edit</Link>
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
            return <Trainee trainee={currentTrainee} key={i} />;
        })
    }
    
    render() {
        return (
            <div>
                <h3>Trainees List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Name</th>
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