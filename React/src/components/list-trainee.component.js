import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from "react-native-crypto-js";
import { codes } from "../secrets/secrets.js";

const Trainee = props => (
    <tr>
        <td>{props.trainee.trainee_fname}</td>
        <td>{props.trainee.trainee_lname}</td>
        <td>{props.trainee.trainee_email}</td>
        <td>
            <button onClick={()=>axios.get('http://localhost:4000/trainee/delete/'+props.trainee._id).then((response) => window.location.reload())}>Delete</button>
        </td>
    </tr>
)

export default class ListTrainee extends Component {
    
    constructor(props) {
        super(props);
                 
       //Added searchString: "" - Ernie

        this.state = {trainees: [], searchString: ""};
        
       //Added onChangeSearch - Ernie
        this.onChangeSearch = this.onChangeSearch.bind(this);
    }
    
    componentDidMount() {
        axios.get('http://localhost:4000/trainee/')
            .then(response => {
                var encrypted = response.data;
                encrypted.map(function(currentTrainee, i){
                    var bytes  = CryptoJS.AES.decrypt(currentTrainee.trainee_email, codes.trainee);
                    currentTrainee.trainee_email = bytes.toString(CryptoJS.enc.Utf8);
                    bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_fname, codes.trainee);
                    currentTrainee.trainee_fname = bytes.toString(CryptoJS.enc.Utf8);
                    bytes = CryptoJS.AES.decrypt(currentTrainee.trainee_lname, codes.trainee);
                    currentTrainee.trainee_lname = bytes.toString(CryptoJS.enc.Utf8);
                });
                this.setState({trainees: encrypted});
            })
            .catch(function (error){
                console.log(error);
            })
    }

    // Added onChangeSearch(e) function. Needed for the search filter - Ernie
    onChangeSearch(e) {
        this.setState({
            searchString: e.target.value
        });
    }


    traineeList(search) {

        let trainees = this.state.trainees;

        // return this.state.trainees.map(function(currentTrainee, i){

        
            if (search.length > 0) {
                this.state.trainees.filter(function (i) {
                    return i.trainee_fname.toLowerCase().match(search)
                    // if (i.trainee_fname.toLowerCase().match(search)){
                    //     return <Trainee trainee={i} key={i} />; 
                    // }
                });
            }

            // return <Trainee trainee={currentTrainee} key={i} />;
        // })
    }
    

    

    render() {

        //Declared variables in order to read input from search function
        
        let trainees = this.state.trainees;
        let search = this.state.searchString.trim().toLowerCase();
        
        if (search.length > 0) {
            trainees = trainees.filter(function (i) {
                return i.trainee_fname.toLowerCase().match(search)
            });
        }

        return (
            <div>
                
                {/* Actual search function - Ernie */}
                <input
                    type="text"
                    value={this.state.searchString}
                    onChange={this.onChangeSearch}
                    placeholder="Find trainee..."
                />

                <h3>Trainees List</h3>
                <Link to={"/create"}>Add Trainee</Link>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>


                    {/* Commented this for now, show list of trainees with all details and delete button */}
                    {/* <tbody>
                        { this.traineeList(search) }
                    </tbody> */}


                    {/* Shows list of trainees that are from the database - Ernie */}
                    
                    <tbody>
                        {trainees.map(t => {
                            return (
                                <tr>
                                    <td> {t.trainee_fname}</td>
                                    <td> {t.trainee_lname}</td>
                                    <td> {t.trainee_email}</td>
                                    <td> 
                                        <button onClick={()=>axios.get('http://localhost:4000/trainee/delete/'+t._id).then((response) => window.location.reload())}>Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            </div>
        )
    }
}