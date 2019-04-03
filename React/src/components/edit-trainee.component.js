import React, { Component } from 'react';
import axios from 'axios';

export default class EditTrainee extends Component {
    
    constructor(props) {
        super(props);
        
        this.onChangeTraineeFname = this.onChangeTraineeFname.bind(this);
        this.onChangeTraineeLname = this.onChangeTraineeLname.bind(this);
        this.onChangeTraineeEmail = this.onChangeTraineeEmail.bind(this);
        this.onChangeTraineeAccount = this.onChangeTraineeAccount.bind(this);
        this.onChangeTraineeSort = this.onChangeTraineeSort.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            trainee_fname: '',
            trainee_lname: '',
            trainee_email: '',
            trainee_account_no: '',
            trainee_sort_code: ''
        }
    }
    
    componentDidMount() {
        axios.get('http://localhost:4000/trainee/'+this.props.match.params.id)
            .then(response => {
                this.setState({
                    trainee_fname: response.data.trainee_fname,
                    trainee_lname: response.data.trainee_lname,
                    trainee_email: response.data.trainee_email,
                    trainee_account_no: response.data.trainee_account_no,
                    trainee_sort_code: response.data.trainee_sort_code
                })   
            })
            .catch(function (error) {
                console.log(error);
            })
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

    onChangeTraineeAccount(e) {
        this.setState({
            trainee_account_no: e.target.value
        });
    }

    onChangeTraineeSort(e) {
        this.setState({
            trainee_sort_code: e.target.value
        });
    }
    
    onSubmit(e) {
        e.preventDefault();
        const obj = {
            trainee_fname: this.state.trainee_fname,
            trainee_lname: this.state.trainee_lname,
            trainee_email: this.state.trainee_email,
            trainee_account_no: this.state.trainee_account_no,
            trainee_sort_code: this.state.trainee_sort_code
        };
        console.log(obj);
        axios.post('http://localhost:4000/trainee/update/'+this.props.match.params.id, obj)
            .then(res => console.log(res.data));
        
        this.props.history.push('/');
    }
    
    render() {
        return (
            <div>
                <h3 align="center">Update Trainee</h3>
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
                        <label>Account Number: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.trainee_account_no}
                                onChange={this.onChangeTraineeAccount}
                                />
                    </div>
                    <div className="form-group">
                        <label>Sort Code: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.trainee_sort_code}
                                onChange={this.onChangeTraineeSort}
                                />
                    </div>
                    <br />
                    <div className="form-group">
                        <input type="submit" value="Update Trainee" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}