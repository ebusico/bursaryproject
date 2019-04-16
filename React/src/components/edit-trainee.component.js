import React, { Component } from 'react';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";

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
                var trainee_fname  = CryptoJS.AES.decrypt(response.data.trainee_fname, codes.trainee);
                var trainee_lname  = CryptoJS.AES.decrypt(response.data.trainee_lname, codes.trainee);
                var trainee_email  = CryptoJS.AES.decrypt(response.data.trainee_email, codes.staff, {iv:codes.iv});
                
                if(response.data.trainee_account_no != null && response.data.trainee_sort_code != null){
                    var trainee_account_no = CryptoJS.AES.decrypt(response.data.trainee_account_no, codes.trainee);
                    var trainee_sort_code = CryptoJS.AES.decrypt(response.data.trainee_sort_code, codes.trainee);
                    this.setState({
                        trainee_account_no: trainee_account_no.toString(CryptoJS.enc.Utf8),
                        trainee_sort_code: trainee_sort_code.toString(CryptoJS.enc.Utf8)
                    })
                }
                
                this.setState({
                    trainee_fname: trainee_fname.toString(CryptoJS.enc.Utf8),
                    trainee_lname: trainee_lname.toString(CryptoJS.enc.Utf8),
                    trainee_email: trainee_email.toString(CryptoJS.enc.Utf8),
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
        var fname = CryptoJS.AES.encrypt(this.state.trainee_fname, codes.trainee);
        var lname = CryptoJS.AES.encrypt(this.state.trainee_lname, codes.trainee);
        var email = CryptoJS.AES.encrypt(this.state.trainee_email, codes.staff, {iv: codes.iv});
        var accountNo = CryptoJS.AES.encrypt(this.state.trainee_account_no, codes.trainee);
        var sortCode = CryptoJS.AES.encrypt(this.state.trainee_sort_code, codes.trainee);
        const obj = {
            trainee_fname: fname.toString(),
            trainee_lname: lname.toString(),
            trainee_email: email.toString(),
            trainee_account_no: accountNo.toString(),
            trainee_sort_code: sortCode.toString()
        };
        console.log(obj);
        axios.post('http://localhost:4000/trainee/update/'+this.props.match.params.id, obj)
            .then(res => console.log(res.data));
        
        this.props.history.push('/trainee-details/'+this.props.match.params.id);
        window.location.reload();
    }
    
    render() {
        return (
            <div>
                <h3 align="center">Update Details</h3>
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
                        <input type="submit" value="Update" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}