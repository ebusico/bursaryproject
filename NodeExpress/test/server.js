'use strict'

let user = require('../models/staff.js');
var CryptoJS = require("crypto-js");
var existingemail = "sZjrgWgK7vj49jcWVAw8e8KskrOOIcbKFvKYboWdUuY="; //set the email of an existing trainee here
var existingStaffEmail = "4QWRatu2iG4jAL95IVDX3wxnEt9ruGQHMb91T/poKtA="; //set the email of an existing user here
var existingId = "5cc9dc038faf56a0a3b16e38"; //set the id of an existing trainee here
var staffExistingId = "5cdd6dbf4b17158d999ed680"; //set the id of an existing staff user here

var expect = require('chai').expect,
	request = require('supertest'),
	should = require('chai').should(),
	//should = require('should'),
	server = require('../server.js');
var chai = require('chai');
var chaiHttp = require('chai-http');

var assert = require('assert'),
	http = require('http');
	
chai.use(chaiHttp);

// BEFORE TESTING
describe('server', function() {
	before(function () { 
		server.listen(4000);
	});
	after(function () {
		server.close();
	})
})

describe('trainee/', () => {
	it('Should get a staus of 200', (done) => {
		chai.request('http://localhost:4000').get('/trainee/').end((err, res) => {
			res.should.have.status(200);
			done();
		});
	});
});


// MOCK DATA
let addUser = {
	'trainee_email': 'testing@aol.co.uk',
	'trainee_password': 'password123',
	'trainee_start_date': '21-01-2019',
	'trainee_end_date': '25-04-2019',
	'trainee_fname': 'John',
	'trainee_lname': 'Adams',
};

let deleteUser = {
	'trainee_email': 'delete@aol.co.uk',
	'trainee_password': 'password123',
	'trainee_start_date': '21-01-2019',
	'trainee_end_date': '25-04-2019',
	'trainee_fname': 'DeleteJohn',
	'trainee_lname': 'Adams',
};

let adminUser = {
	
}

let newPassword = {
	'trainee_password': 'password' 
}

let updateUser = {
	'trainee_email': 'testing@aol.co.uk',
	'trainee_password': 'password123',
	'trainee_fname': 'John',
	'trainee_lname': 'Adams',
	'trainee_account_no': '19982350',
	'trainee_sort_code': '090921',
};

var userId;
	
describe('/add trainee', () => {
	it('Should add a trainee',  (done) => {
		chai.request('http://localhost:4000').post('/trainee/add').set('content-type', 'application/json').send(addUser).end((err, res) => {
			 if (res.status == '200'){
			 	console.log('Account has been created');
			 	done();
			 }
			 else if(res.status == '205'){
				 console.log('email already in use or unable to save correctly');
				 throw new Error('Expected 200 but got 205 meaning email in use or save issue');
			 }
			 else{
			 	throw new Error(`Expected 200 but got ${res}. error is ${err}`);
			 }
		});
	});

	it('getting userId to be used in later functions', () =>{
		chai.request('http://localhost:4000').get('/trainee/').end((err, res) => {
			let i = 0;
			 while(i < res.body.length){
				 if(res.body[i].trainee_email == addUser.trainee_email){
					 console.log("email : "+ res.body[i].trainee_email);
					 console.log("id : "+res.body[i]._id);
					 userId = res.body[i]._id;
					 break;
				 }
				i++;
			 }
			})
	})

	// it('should update the trainee password', (done) => {
	// 	var psw  = CryptoJS.AES.encrypt(newPassword.trainee_password, '3FJSei8zPx').toString();
	// 	psw ={'trainee_password': psw};
	// 	console.log("id for trainee password is: " + existingId);
	// 	chai.request('http://localhost:4000').post('/trainee/update-password/'+existingId).send(psw).end((err, res) => {
	// 		res.status.should.be.equal(404);
	// 		console.log('trainee password has changed');
	// 		done();
	// 	});
	// });
});

describe('/send-email-staff', () => {
	var passwordtkn = "";
	beforeEach(() => {
		it('Should email staff',  () => {
				chai.request('http://localhost:4000').post('/admin/send-email-staff').send({'email': '4QWRatu2iG4jAL95IVDX3wxnEt9ruGQHMb91T/poKtA='}).end((err, res) => {
					if(res.status == '200'){
						console.log("status for STAFFFFFF ISSSS : " + res.status);
						return res.status;
					}
					else{
						throw new Error('The status was not as expected');
					}
				});
			});
	});

	context('getting token and updating',function(){
		it('getting staff details', function() {
			chai.request('http://localhost:4000').get('/admin/staff/'+staffExistingId).end((err, res) => {
					passwordtkn = res.body.password_token;
					chai.request('http://localhost:4000').post('/admin/update-password-staff/'+passwordtkn).send({'password': CryptoJS.AES.encrypt(newPassword.trainee_password, '3FJSei8zPx').toString()}).end((err, res) => {
						if(res.body === 'Password updated!'){
							console.log("password has been updated");
						}
						else{
							throw new Error('Unexpected or incorrect result');
						}
					});
			})
		});
	});

	context('getting token and resetting password',function(){
		it('getting staff details', function() {
			chai.request('http://localhost:4000').get('/admin/staff/'+staffExistingId).end((err, res) => {
					passwordtkn = res.body.password_token;
					chai.request('http://localhost:4000').get('/admin/reset-staff/'+passwordtkn).end((err, res) => {
						res.status.should.be.equal(403);
						console.log('response should be 403 as it has been used above');
					});
			})
		});
	});

	});
	
describe('/send-email', () => {
	var passwordtkn = '';
	before(() => {
		it ('Should send an email', () => {
			chai.request('http://localhost:4000').post('/trainee/send-email').send({trainee_email: existingemail}).end((err, res) => {
				if(res.body.email === "Email Sent"){
					return 'successful';
				}
				else{
					throw new Error("Expected email sent but got something else, add console.log(res), to see full res");
				}
				
			});
		});
	})

	context('getting token and updating trainee', () => {
		it('getting staff details', function() {
			chai.request('http://localhost:4000').get('/trainee/'+existingId).end((err, res) => {
					passwordtkn = res.body.trainee_password_token;
					newPassword.trainee_password = CryptoJS.AES.encrypt(newPassword.trainee_password, '3FJSei8zPx').toString()
					chai.request('http://localhost:4000').post('/trainee/update-password/'+passwordtkn).send(newPassword).end((err, res) => {
						if(res.body === 'Password updated!'){
							console.log("password has been updated for trainee");
						}
						else{
							throw new Error('Unexpected or incorrect result trainee');
						}
					});
			})
		});
	})

	context('getting token and resetting password',function(){
		it('getting trainee details', function() {
			chai.request('http://localhost:4000').get('/trainee/'+existingId).end((err, res) => {
					passwordtkn = res.body.password_token;
					chai.request('http://localhost:4000').get('/trainee/reset/'+passwordtkn).end((err, res) => {
						res.status.should.be.equal(403);
						console.log('response should be 403 as it has been used above');
					});
			})
		});
	});
	});

describe('/update:id', () => {
	it('Should update user account',  (done) => {
		chai.request('http://localhost:4000').post('/trainee/update/'+userId).send(updateUser).end((err, res) => {
			res.status.should.be.equal(200);
			console.log('Account has been updated');
			done();
		});
	});
});


describe('/trainee:id', () => {
	it('Should return details of "John"', (done) => {
		chai.request('http://localhost:4000').get('/trainee/'+userId).end((err, res) => {
			res.should.have.status(200);
			done();
		});
	});
});

// Register Test and Failed Login Test

let loginUser = { 
	'email': 'johndoe@aol.co.uk',
	'password': 'password123',
	};
let register_details = {
	'email': 'johndoe@aol.co.uk',
	'password': 'password123',
	'role': 'admin',
};
describe ('Create account and remove after test', () =>{
	before((done) => {
		user.remove({'email': 'L2wFtkap90n3hfiqZlqbIhUHxvVk1z8Q5QBTyT0m+vA='}, function (err){
			if(err){
				console.log(handleError(err));
				throw new Error("encountered error");
			}
			else{
				done();
			}
		})
	});
		after((done) => {
			user.remove({'email': 'L2wFtkap90n3hfiqZlqbIhUHxvVk1z8Q5QBTyT0m+vA='}, function (err){
				if(err){
					console.log(handleError(err));
					throw new Error("encountered error");
				}
				else{
					done();
				}
			})
		});
		
describe('/POST Register', function () {
	it('Should Register user account', (done) => {
		chai.request('http://localhost:4000').post('/admin/addUser/postman').set('content-type', 'application/json').send(register_details).end((err, res) => {
			res.status.should.be.equal(200);
			console.log('Account has been Registered');
			done();
	});
});
	it('should give status 400 when incorrect password is used', function (done){
		chai.request('http://localhost:4000').post('/auth/login').field('username', '')
		.field('password', '')
		.end((err, res) => {
				console.log('User has wrong password');
				res.status.should.be.equal(400);
				done();
			});
  });
});
});

describe('get staff list', () => {
	it('Should show Staff list', (done) => {
		chai.request('http://localhost:4000').get('/admin/').end((err, res) => {
			res.status.should.be.equal(200);
			console.log('Staff list shows');
			done();
		});
	});
});

describe('delete user via id', function() {
	it('Should delete account',  (done) => {

		this.timeout(300000);

		setTimeout(function () {
			expect(userId != undefined);
			console.log("id to delete is : "+ userId);

			chai.request('http://localhost:4000').get('/trainee/delete/'+ userId).end((err, res) => {
				console.log('result is : '+ res.body.result);
				res.should.have.status(200);
				done();
			});
		});
		}, 300000);
	});

describe('/admin/getByEmail', function() {
	it('it should get staff user via email', (done) => {
		//'4QWRatu2iG4jAL95IVDX3wxnEt9ruGQHMb91T/poKtA='
		chai.request('http://localhost:4000').post('/admin/getByEmail').send({'staff_email': '4QWRatu2iG4jAL95IVDX3wxnEt9ruGQHMb91T/poKtA='}).end((err, res) => {
			if(res.body != null){
				console.log('shouldve returned user details');
				done();
			}
			else{
				throw new Error(res);

			}
			
		})
	})
})