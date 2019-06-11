import React, { Component } from 'react';
import axios from 'axios';
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';
import '../css/edit-list-trainee.css';
import ok from './icons/ok.svg';
import close from './icons/close.svg';


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
            accountOver: false,
            sortOver: false,
            accountError: false,
            sortError: false,
            currentUser: authService.currentUserValue,
            disabled: false
        }
    }
    
    componentDidMount() {
        axios.get('http://'+process.env.REACT_APP_AWS_IP+':4000/trainee/'+this.props.match.params.id)
            .then(response => {
                console.log(response.data);
                if(response.data.bursary==="True"){
                    this.setState({
                        trainee_fname: response.data.trainee_fname,
                        trainee_lname: response.data.trainee_lname,
                        trainee_email: response.data.trainee_email,
                        trainee_bank_name: response.data.trainee_bank_name,
                        trainee_account_no: response.data.trainee_account_no,
                        trainee_sort_code: response.data.trainee_sort_code,
                        trainee_bursary: response.data.bursary
                    })  
                }else{
                    this.setState({
                        trainee_fname: response.data.trainee_fname,
                        trainee_lname: response.data.trainee_lname,
                        trainee_email: response.data.trainee_email,
                        trainee_bursary: response.data.bursary,
                        trainee_bank_name: " ",
                        trainee_account_no: " ",
                        trainee_sort_code: " "
                    })
                }
                 
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
        console.log(this.state.trainee_account_no);

        let sortcodelen = document.getElementById("sortcode").value;
        let accountlen = document.getElementById("accountnumber").value;

        if(accountlen){
            if( accountlen.length === 8){
                document.getElementById("accountnumber").style.borderColor = "green";
                document.getElementById("accountnumber").style.borderWidth = "thick";
                document.getElementById("accountImg").src = ok;
                document.getElementById("accountImg").style.visibility = "visible"
                if( sortcodelen!= undefined){
                    if(sortcodelen.length  === 6){
                        document.getElementById("updateBtn").disabled = false;
                    }
                }
            }
            else if(accountlen.length > 8 || accountlen.length < 8){
                document.getElementById("accountnumber").style.borderColor = "red";
                document.getElementById("accountnumber").style.borderWidth = "thick";
                document.getElementById("updateBtn").disabled = true;
                document.getElementById("accountImg").src = close;
                document.getElementById("accountImg").style.visibility = "visible"
            }
        }
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

        let sortcodelen = document.getElementById("sortcode").value;
        let accountlen = document.getElementById("accountnumber").value;

        if(sortcodelen){
            if(sortcodelen.length === 6){
                document.getElementById("sortcode").style.borderColor = "green";
                document.getElementById("sortcode").style.borderWidth = "thick";
                document.getElementById("sortImg").src = ok;
                document.getElementById("sortImg").style.visibility = "visible";
                if( accountlen!= undefined){
                    if(accountlen.length === 8){
                        document.getElementById("updateBtn").disabled = false;
                    }
                }
            }
            else if(sortcodelen.length > 6 || sortcodelen.length < 6){
                document.getElementById("sortcode").style.borderColor = "red";
                document.getElementById("sortcode").style.borderWidth = "thick";
                document.getElementById("updateBtn").disabled = true;
                document.getElementById("sortImg").src = close;
                document.getElementById("sortImg").style.visibility = "visible";
            }
        }
    }
    
    onSubmit(e) {
        e.preventDefault();
        var formatted_sort_code = '';
        const updated_trainee = {
            trainee_fname: this.state.trainee_fname,
            trainee_lname: this.state.trainee_lname,
            trainee_email: this.state.trainee_email,
            trainee_bank_name: this.state.trainee_bank_name,
            trainee_account_no: this.state.trainee_account_no,
            trainee_sort_code: this.state.trainee_sort_code
        };
        if(this.state.trainee_bursary==="True"){
            if(this.state.trainee_sort_code.charAt(0) == 0){
                formatted_sort_code = this.state.trainee_sort_code.slice(1);
            }
            else{
                formatted_sort_code =this.state.trainee_sort_code;
            }

            const new_bank = {
                SortCode: formatted_sort_code,
                BankName: this.state.trainee_bank_name.toUpperCase(),
                Branch: this.state.trainee_bank_branch.toUpperCase()
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
        }else{
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
        }else if(this.state.trainee_bursary==="False"){
            return(
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
                    <br />
                    <div className="form-group">
                        <input id="updateBtn" type="submit" value="Update" className="btn btn-primary"/>
                    </div>
					</div>
				</form>
            </div>

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
                        <label>Sort Code: </label>
                        <br />
                        <div className="validated-field-container">
                            <input 
                                    type="number"
                                    id="sortcode" 
                                    className="form-control"
                                    placeholder= "eg. 987654"
                                    value={this.state.trainee_sort_code}
                                    onChange={this.onChangeTraineeSort}
                                    required minLength = {6}
                                    />
                            <img id="sortImg"></img>
                        </div>
                        
                    </div>
                    <div className="form-group"> 
                        <label>Account Number: </label>
                        <br />
                        <div className="validated-field-container">
                            
                            <input  type="number"
                                    id="accountnumber"
                                    className="form-control"
                                    placeholder= "eg. 12345678"
                                    value={this.state.trainee_account_no}
                                    onChange={this.onChangeTraineeAccount}
                                    required minLength = {8}
                                    />
                            <img id="accountImg"></img> 
                        </div>
                    </div>
                    {show_matching_bank ?
                        <div>
                        <div className="form-group"> 
                            <label>Bank Name: </label> <br></br>
                            <label>{this.state.trainee_bank_name}</label>
                        </div>
                        <div className="form-group"> 
                            <label>Bank Address: </label> <br></br>
                            <label>{this.state.trainee_bank_branch}</label>                              
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
                                maxLength="20"
                                required
                                />
                            <br/>
                            <label>Bank Address: </label>
                            <input  type="text"
                                className="form-control"
                                value={this.state.trainee_bank_branch}
                                onChange={this.onChangeTraineeBankBranch}
                                placeholder= "eg. OXFORD ROAD, LONDON"
                                maxLength="30"
                                required
                                />                                
                        </div>
                    : ""}

                    <br />
                    <div className="form-group">
                            <input id="updateBtn" type="submit" value="Update" className="btn btn-primary" />
                    </div>
					</div>
				</form>
            </div>
        )
    }
  }
}