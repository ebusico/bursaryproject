import React, { Component } from 'react';
import axios from 'axios';
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
        this.onChangeTraineeBankName = this.onChangeTraineeBankName.bind(this);
        this.onChangeTraineeBankBranch = this.onChangeTraineeBankBranch.bind(this);
		
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            trainee_fname: '',
            trainee_lname: '',
            trainee_email: '',
            trainee_bank_name: '',
            trainee_bank_branch: '',
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
                this.setState({
                    trainee_fname: response.data.trainee_fname,
                    trainee_lname: response.data.trainee_lname,
                    trainee_email: response.data.trainee_email,
                    trainee_bank_name: response.data.trainee_bank_name,
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

	onChangeTraineeBankName(e){
		this.setState ({
			trainee_bank_name:e.target.value
		});
    }
    
    onChangeTraineeBankBranch(e){
		this.setState ({
			trainee_bank_branch:e.target.value
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
                        trainee_bank_branch: res.data.Branch,
                        show_matching_bank: true
                    })
                }
                else{
                    this.setState({
                        trainee_bank_name: '',
                        trainee_bank_branch: '',
                        show_non_matching_bank: true,
                        similar_codes: res.data.OtherCodes
                    })
                }
            });
        }
        else{
            this.setState({
                trainee_bank_name: '',
                trainee_bank_branch: '',
                show_matching_bank: false,
                show_non_matching_bank: false
            })
        }
    }
    
    onSubmit(e) {
        e.preventDefault();
        var formatted_sort_code = '';

        if(this.state.trainee_sort_code.charAt(0) == 0){
            formatted_sort_code = this.state.trainee_sort_code.slice(1);
        }
        else{
            formatted_sort_code =this.state.trainee_sort_code;
        }
		
        const updated_trainee = {
            trainee_fname: this.state.trainee_fname,
            trainee_lname: this.state.trainee_lname,
            trainee_email: this.state.trainee_email,
			trainee_bank_name: this.state.trainee_bank_name,
            trainee_account_no: this.state.trainee_account_no,
            trainee_sort_code: this.state.trainee_sort_code
        };

        const new_bank = {
            SortCode: formatted_sort_code,
            BankName: this.state.trainee_bank_name.toUpperCase,
            Branch: this.state.trainee_bank_branch.toUpperCase
        }
        if(this.state.show_non_matching_bank == true){
            axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/update/'+this.props.match.params.id, updated_trainee)
            .then(res => {
                console.log(res.data);
                console.log(new_bank);
                axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/addBank/', new_bank)
                .then(res => {
                    console.log(res.data);
                    this.props.history.push('/trainee-details/'+this.props.match.params.id);
                });
            });
        }
        else{
            axios.post('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/update/'+this.props.match.params.id, updated_trainee)
            .then(res => {
                console.log(res.data);
                this.props.history.push('/trainee-details/'+this.props.match.params.id);
            });
        }
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
                                placeholder= "eg. 12345678"
                                value={this.state.trainee_account_no}
                                onChange={this.onChangeTraineeAccount}
                                maxLength="8"
                                required minLength = {8}
                                />
                    </div>
                    <div className="form-group">
                        <label>Sort Code: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                placeholder= "eg. 987654"
                                value={this.state.trainee_sort_code}
                                onChange={this.onChangeTraineeSort}
                                maxLength="6"
                                required minLength = {6}
                                />
                    </div>
                    {show_matching_bank ?
                        <div>
                        <div className="form-group"> 
                            <label>Bank Name: </label>
                            <input  type="text"
                                className="form-control"
                                value={this.state.trainee_bank_name}
                                disabled
                                />                              
                        </div>
                        <div className="form-group"> 
                            <label>Bank Address: </label>                               
                            <input  type="text"
                                className="form-control"
                                value={this.state.trainee_bank_branch}
                                disabled
                                />                                
                        </div>
                        </div>
                    : ""}
                    {show_non_matching_bank ?
                        <div className="form-group" >
                            <div>Sort code not found, similar sort codes shown below:</div>
                            {this.state.similar_codes.map((code, index) => (
                                <div key={index}>- {code}</div>
                            ))}
                            <div>Please make sure the sort code you entered is correct, and then enter your bank details:</div>
                            <br/>
                            <label>Bank Name: </label>
                            <input  type="text"
                                className="form-control"
                                value={this.state.trainee_bank_name}
                                onChange={this.onChangeTraineeBankName}
                                placeholder= "eg. HALIFAX"
                                required
                                />
                            <br/>
                            <label>Bank Address: </label>
                            <input  type="text"
                                className="form-control"
                                value={this.state.trainee_bank_branch}
                                onChange={this.onChangeTraineeBankBranch}
                                placeholder= "eg. OXFORD ROAD, LONDON"
                                required
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