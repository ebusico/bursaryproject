import React, { Component } from 'react';
import axios from 'axios';
import AccessDenied from './modules/AccessDenied';
import { authService } from './modules/authService';

export default class TraineeSettings extends Component{
    constructor(props){
        super(props)
        this.state = {
            bank_holidays: false,
            bursary_amount: "30"
        }
        this.onClickBankHolidays = this.onClickBankHolidays.bind(this);
        this.onChangeBursaryAmount = this.onChangeBursaryAmount.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    componentDidMount(){
        axios.get('http://' + process.env.REACT_APP_AWS_IP + ':4000/settings/').then(response =>{
            console.log(response.data);
            this.setState({bank_holidays: response.data.pay_bank_holidays,
                            bursary_amount: response.data.default_bursary});
        })
    }
    onClickBankHolidays(e) {
        if(this.state.bank_holidays===true){
            this.setState({
                bank_holidays: false
            
			});
			console.log(this.state.bank_holidays);
        }
        else{
            this.setState({
                bank_holidays: true
            });
			console.log(this.state.bank_holidays);
        }
    }
    onChangeBursaryAmount(e){
        this.setState({
            bursary_amount: e.target.value.toString()
        })
    }
    onSubmit(e){
        e.preventDefault();
        console.log(this.state);
        axios.post('http://' + process.env.REACT_APP_AWS_IP + ':4000/settings/editSettings', this.state).then(response =>{
                console.log(response);
                this.props.history.push('/');
            }
        )
    }
    render(){
        console.log(this.state)
        return(
            <div className="QAtable">
                <div className="QASearchBar">
                <h3 className="title">Global settings for trainees</h3>
                </div>
            <div className="createTrainee" style={{marginLeft: 200, marginRight: 200}}>
                <form className="createTraineeForm" onSubmit={this.onSubmit}>
                    <div className="form-group">
						<label> Pay for Bank Holidays: </label> 
						&nbsp;&nbsp;
						<input type="checkbox" id="bursaryValue" checked={this.state.bank_holidays} onClick={this.onClickBankHolidays}/>
                    </div>

                    <div className="form-group">
                        <label> Default daily bursary amount</label>
                        &nbsp;&nbsp;
                        <input type="number" 
                                value={this.state.bursary_amount}
                                onChange={this.onChangeBursaryAmount}
                                required/>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Update settings" className="btn btn-primary" />
                    </div>
                </form>
            </div>
            </div>
        );
    }
    
}