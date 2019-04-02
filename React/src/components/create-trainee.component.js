import React, { Component } from 'react';
import axios from 'axios';

export default class CreateTrainee extends Component {
    
    constructor(props) {
        super(props);
        
        this.onChangeTraineeName = this.onChangeTraineeName.bind(this);
        this.onChangeTraineeEmail = this.onChangeTraineeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            trainee_name: '',
            trainee_email: '',
        }
    }
    
    onChangeTraineeName(e) {
        this.setState({
            trainee_name: e.target.value
        });
    }

    onChangeTraineeEmail(e) {
        this.setState({
            trainee_email: e.target.value
        });
    }
    
    onSubmit(e) {
        e.preventDefault();
        
        console.log(`Form submitted:`);
        console.log(`Trainee Name: ${this.state.trainee_name}`);
        console.log(`Trainee Email: ${this.state.trainee_email}`);
        
        const newTrainee = {
            trainee_name: this.state.trainee_name,
            trainee_email: this.state.trainee_email
        };
        
        axios.post('http://localhost:4000/trainee/add', newTrainee)
            .then(res => console.log(res.data)); 
        
        axios.post('http://localhost:4000/trainee/send-email', newTrainee)
            .then(res => console.log(res.data));

        this.setState({
            trainee_name: '',
            trainee_email: '',
        })
    }
    
   render() {
        return (
            <div style={{marginLeft: 100, marginRight: 100}}>
                <h3>Add Trainee</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                        <label>Name: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.trainee_name}
                                onChange={this.onChangeTraineeName}
                                />
                    </div>
                    <div className="form-group">
                        <label>Email: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.trainee_email}
                                onChange={this.onChangeTraineeEmail}
                                />
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Add Trainee" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}