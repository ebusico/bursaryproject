import React, { Component } from 'react';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import '../css/edit-list-trainee.css';


export default class EditTrainee extends Component {
    
    constructor(props) {
        super(props);
        
        this.onChangeTraineeFname = this.onChangeTraineeFname.bind(this);
        this.onChangeTraineeLname = this.onChangeTraineeLname.bind(this);
        this.onChangeTraineeEmail = this.onChangeTraineeEmail.bind(this);
        this.onChangeTraineeAccount = this.onChangeTraineeAccount.bind(this);
        this.onChangeTraineeSort = this.onChangeTraineeSort.bind(this);
		this.onChangeTraineeBankOther = this.onChangeTraineeBankOther.bind(this);
		
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            trainee_fname: '',
            trainee_lname: '',
            trainee_email: '',
			trainee_bank_name: '',
            trainee_account_no: '',
            trainee_sort_code: '',
            similar_codes: [],
            show_matching_bank: false,
            show_non_matching_bank: false,
			currentUser: authService.currentUserValue
        }
    }
    
    componentDidMount() {
        axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/'+this.props.match.params.id)
            .then(response => {
                var trainee_fname  = CryptoJS.AES.decrypt(response.data.trainee_fname, codes.trainee);
                var trainee_lname  = CryptoJS.AES.decrypt(response.data.trainee_lname, codes.trainee);
                var trainee_email  = CryptoJS.AES.decrypt(response.data.trainee_email, codes.staff, {iv:codes.iv});
                
                if(response.data.trainee_account_no != null && response.data.trainee_sort_code != null){
					var trainee_bank_name = CryptoJS.AES.decrypt(response.data.trainee_bank_name, codes.trainee);
                    var trainee_account_no = CryptoJS.AES.decrypt(response.data.trainee_account_no, codes.trainee);
                    var trainee_sort_code = CryptoJS.AES.decrypt(response.data.trainee_sort_code, codes.trainee);
                    this.setState({
						trainee_bank_name: trainee_bank_name.toString(CryptoJS.enc.Utf8),
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
	onChangeTraineeBankOther(e){
		this.setState ({
			trainee_bank_name:e.target.value
		});
	}
	
	showMatchingBank(e){
}

    onChangeTraineeAccount(e) {
        this.setState({
            trainee_account_no: e.target.value
        });
    }

    onChangeTraineeSort(e) {
        this.setState({
            trainee_sort_code: e.target.value
        })
        if(e.target.value.length > 5){
            let sortcode = e.target.value;
            if(sortcode.charAt(0) == 0){
                sortcode = sortcode.slice(1);
                console.log(sortcode);
            }
            axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/findBank', {sort_code: sortcode})
            .then(res => {
                if(res.data.Match == true){
                    console.log(res.data.BankName)
                    this.setState({
                        trainee_bank_name: res.data.BankName,
                        show_matching_bank: true
                    })
                }
                else{
                    this.setState({
                        trainee_bank_name: "",
                        show_non_matching_bank: true,
                        similar_codes: res.data.OtherCodes
                    })
                }
            });
        }
        else{
            this.setState({
                show_matching_bank: false,
                show_non_matching_bank: false
            })
        }
    }
    
    onSubmit(e) {
        e.preventDefault();
        var fname = CryptoJS.AES.encrypt(this.state.trainee_fname, codes.trainee);
        var lname = CryptoJS.AES.encrypt(this.state.trainee_lname, codes.trainee);
        var email = CryptoJS.AES.encrypt(this.state.trainee_email, codes.staff, {iv: codes.iv});
        var bankName = CryptoJS.AES.encrypt(this.state.trainee_bank_name, codes.trainee);
		var accountNo = CryptoJS.AES.encrypt(this.state.trainee_account_no, codes.trainee);
        var sortCode = CryptoJS.AES.encrypt(this.state.trainee_sort_code, codes.trainee);
		
        const obj = {
            trainee_fname: fname.toString(),
            trainee_lname: lname.toString(),
            trainee_email: email.toString(),
			trainee_bank_name:bankName.toString(),
            trainee_account_no: accountNo.toString(),
            trainee_sort_code: sortCode.toString()
        };
        console.log(obj);
        axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/update/'+this.props.match.params.id, obj)
            .then(res => {
                console.log(res.data);
                this.props.history.push('/trainee-details/'+this.props.match.params.id);
                window.location.reload();
            });
    }

    render() {
        const {show_matching_bank} = this.state;
        const {show_non_matching_bank} = this.state;
		
		if(this.state.currentUser.token.role !== undefined){
			return (
			<AccessDenied/>
		);
		}else{
        return (
            <div className="QATable">
                <form className="edit-form" onSubmit={this.onSubmit}>
                    <div className="all-edit-box">
					<div className="form-group"> 
                        <label>First Name: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.trainee_fname}
                                onChange={this.onChangeTraineeFname}
                                disabled
                                />
                    </div>
                     <div className="form-group"> 
                        <label>Last Name: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.trainee_lname}
                                onChange={this.onChangeTraineeLname}
                                disabled
                                />
                    </div>           
                    <div className="form-group">
                        <label>Email: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.trainee_email}
                                onChange={this.onChangeTraineeEmail}
                                disabled
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
                    {show_matching_bank ?
                        <div className="form-group"> 
                            <label>Bank: </label>
                            <input  type="text"
                                className="form-control"
                                value={this.state.trainee_bank_name}
                                onChange={this.onChangeTraineeBankOther}
                                disabled
                                />
                        </div>
                    : ""}
                    {show_non_matching_bank ?
                        <div className="form-group">
                            <div>Sort code not found, similar sort codes shown below:</div>
                            {this.state.similar_codes.map((code, index) => (
                                <div key={index}>- {code}</div>
                            ))}
                            <div>Please make sure the sort code you entered is correct, and then enter your bank name</div>
                            <br/>
                            <label>Bank Name: </label>
                            <input  type="text"
                                className="form-control"
                                value={this.state.trainee_bank_name}
                                onChange={this.onChangeTraineeBankOther}
                                />
                        </div>
                    : ""}

                    <br />
                    <div className="form-group">
                        <input type="submit" value="Update" className="btn btn-primary" />
                    </div>
					</div>
				</form>
            </div>
        )
    }
  }
}