import React, { Component } from 'react';
import axios from 'axios';

export default class CreateTrainee extends Component {
    
    constructor(props) {
        super(props);
        
        this.onChangeTraineeFname = this.onChangeTraineeFname.bind(this);
        this.onChangeTraineeLname = this.onChangeTraineeLname.bind(this);
        this.onChangeTraineeEmail = this.onChangeTraineeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            trainee_fname: '',
            trainee_lname: '',
            trainee_email: '',
        }
    }
    
    onChangeTraineeFname(e) {
        this.setState({
            trainee_fname: e.target.value
        });
    }
    
    onChangeTraineeLname(e) {
        this.setState({
            trainee_lname: e.target.value
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
        console.log(`Trainee Fname: ${this.state.trainee_fname}`);
        console.log(`Trainee Lname: ${this.state.trainee_lname}`);
        console.log(`Trainee Email: ${this.state.trainee_email}`);
        
        const newTrainee = {
            trainee_fname: this.state.trainee_fname,
            trainee_lname: this.state.trainee_lname,
            trainee_email: this.state.trainee_email
        };
        
        axios.post('http://localhost:4000/trainee/add', newTrainee)
            .then(res => console.log(res.data)); 
        
        axios.post('http://localhost:4000/trainee/send-email', newTrainee)
            .then(res => console.log(res.data));

        this.setState({
            trainee_fname: '',
            trainee_lname: '',
            trainee_email: '',
        })
        
        this.props.history.push('/');
    }
    
   render() {
        return (
            <div style={{marginLeft: 100, marginRight: 100}}>
                <h3>Add Trainee</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                        <label>First Name: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.trainee_fname}
                                onChange={this.onChangeTraineeFname}
                                />
                    </div>
                    <div className="form-group"> 
                        <label>Last Name: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.trainee_lname}
                                onChange={this.onChangeTraineeLname}
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