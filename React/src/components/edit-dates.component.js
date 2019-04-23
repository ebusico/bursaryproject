import React, { Component } from 'react';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import '../css/edit-list-trainee.css';
import { DropdownList } from 'react-widgets'

export default class EditDates extends Component {
    
    constructor(props) {
        super(props);
        
        this.onChangeTraineeFname = this.onChangeTraineeFname.bind(this);
        this.onChangeTraineeLname = this.onChangeTraineeLname.bind(this);
        this.onChangeTraineeEmail = this.onChangeTraineeEmail.bind(this);
        this.onChangeTraineeAccount = this.onChangeTraineeAccount.bind(this);
        this.onChangeTraineeSort = this.onChangeTraineeSort.bind(this);
		this.onChangeTraineeBank = this.onChangeTraineeBank.bind(this);
		
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            trainee_fname: '',
            trainee_lname: '',
            trainee_email: '',
			trainee_bank_name: '',
            trainee_account_no: '',
            trainee_sort_code: '',
			currentUser: authService.currentUserValue
        }
    }
    
    componentDidMount() {
        axios.get('http://localhost:4000/trainee/'+this.props.match.params.id)
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
	
	onChangeTraineeBank(e){
		this.setState({
			trainee_bank_name:e.target.value
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
        axios.post('http://localhost:4000/trainee/update/'+this.props.match.params.id, obj)
            .then(res => console.log(res.data));
        
        this.props.history.push('/trainee-details/'+this.props.match.params.id);
        window.location.reload();
    }

    render() {
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
                        <label>Bank Name: </label> 
					<select value={this.state.trainee_bank_name} onChange={this.onChangeTraineeBank}>
						<option value="Abbey National">Abbey National</option>
						<option value="AL Rayan Bank">ALRayanBank</option>
						<option value="Alliance & Leicester">Alliance & leicester</option>
						<option value="Allied Irish Bank">Allied Irish Bank</option>
						<option value="Allied Irish Bank (AIB)">Allied Irish Bank (AIB)</option>
						<option value="Bank of China">Bank of China</option>
						<option value="Bank of Ireland">Bank of Ireland</option>
						<option value="Bank of Scotland">Bank of Scotland</option>
						<option value="Barclays">Barclays</option>
						<option value="Bradford & Bingley">Bradford & Bingley</option>
						<option value="CardOneBanking">CardOneBanking</option>
						<option value="Citibank">Citibank</option>
						<option value="Co-Operative Bank">Co-Operative Bank</option>
						<option value="Clockwise Credit Union">Clockwise Credit Union</option>
						<option value="Cumberland Building Society">Cumberland Building Society</option>
						<option value="Danske Bank">Danske Bank</option>
						<option value="First Direct">First Direct</option>
						<option value="First Trust Bank">First Trust Bank</option>
						<option value="Halifax">Halifax</option>
						<option value="HSBC">HSBC</option>
						<option value="Intelligent Finanace">Intelligent Finanace</option>
						<option value="Lloyds">Lloyds</option>
						<option value="M&S Bank">M&S Bank</option>
						<option value="Metro Bank">Metro Bank</option>
						<option value="Nationwide">Nationwide</option>
						<option value="NatWest">NatWest</option>
						<option value="Santander">Santander</option>
						<option value="Royal Bank of Scotland">Royal Bank of Scotland</option>
						<option value="Tesco Bank">Tesco Bank</option>
						<option value="St James Place Bank">St James Place Bank</option>
						<option value="Secure Trust">Secure Trust</option>
						<option value="Smile">Smile</option>
						<option value="Thinkmoney">Thinkmoney</option>
						<option value="TSB">TSB</option>
						<option value="Virgin Money Plc">Virgin Money Plc</option>
						<option value="Woolwich">Woolwich</option>
						<option value="Yorkshire Bank">Yorkshire Bank</option>
						<option value="Yorkshire Banking Society">Yorkshire Banking Society</option>
						<option value="Triodos Bank">Triodos Bank</option>				
				</select>
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
					</div>
				</form>
            </div>
        )
    }
  }
}