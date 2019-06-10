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
	'trainee_email': 'test@test.test',
	'trainee_password': 'password123',
	'trainee_start_date': "Wed May 01 2019 12:00:00 GMT+0100 (GMT Summer Time)",
	'trainee_end_date': "Wed Jul 24 2019 00:00:00 GMT+0100 (GMT Summer Time)",
	'trainee_fname': 'John',
	'trainee_lname': 'Adams',
	'trainee_bursary_amount': '30',
	'bursary': 'True',
	'trainee_bench_start_date': "Thur Jun 25 2019",
	'trainee_bench_end_date': "Wed Jul 31 2019",
	'trainee_days_worked': '1',
	'bank_holiday': 'true'
};

let addUser2 = {
	'trainee_email': 'test2@test.test',
	'trainee_password': 'password123',
	'trainee_start_date': "Wed May 01 2019 12:00:00 GMT+0100 (GMT Summer Time)",
	'trainee_end_date': "Wed Jun 24 2019 00:00:00 GMT+0100 (GMT Summer Time)",
	'trainee_fname': 'John',
	'trainee_lname': 'Adams',
	'trainee_bursary_amount': '0',
	'bursary': 'False',
	'trainee_bench_start_date': "Thur Jun 25 2019",
	'trainee_bench_end_date': "Wed Aug 31 2019",
	'trainee_days_worked': '1',
	'bank_holiday': 'true'
};

let adminUser = {
	
}

let newPassword = {
	'trainee_password': 'password' 
}

let updateUser = {
	'trainee_email': 'test@test.test',
	'trainee_password': 'password123',
	'trainee_fname': 'John',
	'trainee_lname': 'Adams',
	'trainee_account_no': '19982350',
	'trainee_sort_code': '090921',
	'trainee_bank_name': 'Bank'
};

let updateDates = {
	'trainee_start_date': "Wed May 01 2019 12:00:00 GMT+0100 (GMT Summer Time)",
	'trainee_end_date': "Wed Jul 24 2019 00:00:00 GMT+0100 (GMT Summer Time)",
	'trainee_bench_start_date': "Thur Jun 25 2019",
	'trainee_bench_end_date': "Wed Aug 31 2019"
}

let updateBursary = {
	'trainee_bursary_amount': '50',
	'bursary': 'true'
}

describe('trainee tests', () => {
	var userId;
	var userEmail;
	var token;
	before((done) => { 
		chai.request('http://localhost:4000').post('/trainee/add').set('content-type', 'application/json').send(addUser).end((err, res) => {
			 if (res.status == '200'){
			 	console.log('Account has been created');
				chai.request('http://localhost:4000').get('/trainee/').end((err, res) => {
					let i = 0;
						while(i < res.body.length){
							if(res.body[i].trainee_email == addUser.trainee_email){
								console.log("email : "+ res.body[i].trainee_email);
								console.log("id : "+res.body[i]._id);
								userId = res.body[i]._id;
								userEmail = res.body[i].trainee_email;
								break;
							}
						i++;
					}
					chai.request('http://localhost:4000').post('/trainee/daysToWork').send({'trainee_email': userEmail}).end((err, res) => {
					});
					done();
				});
			 }
			 else if(res.status == '205'){
				 console.log('email already in use or unable to save correctly');
				 throw new Error('Expected 200 but got 205 meaning email in use or save issue');
			 }
			 else{
			 	 throw new Error(`Expected 200 but got ${res}. error is ${err}`);
			 }
		});
//		chai.request('http://localhost:4000').post('/trainee/add').set('content-type', 'application/json').send(addUser2).end((err, res) => {
//			 if (res.status == '200'){
//			 	console.log('Account has been created');
//				chai.request('http://localhost:4000').get('/trainee/').end((err, res) => {
//					let i = 0;
//						while(i < res.body.length){
//							if(res.body[i].trainee_email == addUser2.trainee_email){
//								console.log("email : "+ res.body[i].trainee_email);
//								console.log("id : "+res.body[i]._id);
//								userId = res.body[i]._id;
//								userEmail = res.body[i].trainee_email;
//								break;
//							}
//						i++;
//					}
//					chai.request('http://localhost:4000').post('/trainee/daysToWork').send({'trainee_email': userEmail}).end((err, res) => {
//					});
//				});
//			 }
//		});
	});
//	after((done) => {
//		chai.request('http://localhost:4000').get('/trainee/').end((err, res) => {
//			let i = 0;
//				while(i < res.body.length){
//					if(res.body[i].trainee_email == addUser.trainee_email){
//						console.log("email : "+ res.body[i].trainee_email);
//						console.log("id : "+res.body[i]._id);
//						userId = res.body[i]._id;
//						break;
//					}
//				i++;
//			}
//			chai.request('http://localhost:4000').get('/trainee/delete/' + userId).end((err, res) => {
//				console.log(res.body);
//				addUser.delete();
//				done();
//			});
//		});
//	});

	it('add trainee', (done) =>{
		console.log('Trainee Added');
		done();
	});

	it('suspend trainee', (done) =>{
		chai.request('http://localhost:4000').get('/trainee/delete/' + userId).end((err, res) => {
			if (res.status == '200'){
				console.log(res.body);
				done();
			}
			else {
				console.log('suspension failed');
			}
		});
	});

	it('unsuspend trainee', (done) =>{
		chai.request('http://localhost:4000').get('/trainee/reactivate/' + userId).end((err, res) => {
			if (res.status == '200'){
				console.log(res.body);
				done();
			}
			else {
				console.log('reactivation failed');
			}
		});
	});

	it('update days worked for trainee', (done) =>{
		chai.request('http://localhost:4000').post('/trainee/daysToWork/' + userId).send({'trainee_days_worked': '10'}).end((err, res) => {
			if (res.status == '200'){
				console.log(res.body);
				done();
			}
			else if (res.status == '400' || '404'){
				console.log(res.body);
			}
			else {
				console.log('test failed for unknown reasons');
			}
		});
	});

	it('update trainee details', (done) => {
		chai.request('http://localhost:4000').post('/trainee/update/' + userId).send(updateUser).end((err, res) => {
			if (res.status == '200'){
				console.log(res.body);
				done();
			}
			else if (res.status == '404' || '400'){
				console.log(res.body);
			}
			else {
				console.log('test failed for unknown reasons');
			}
		});
	});
	
	it('update trainee bursary details', (done) => {
		chai.request('http://localhost:4000').post('/trainee/editBursary/' + userId).send(updateBursary).end((err, res) => {
			if (res.status == '200'){
				console.log(res.body);
				done();
			}
			else if (res.status == '404' || '400'){
				console.log(res.body);
			}
			else {
				console.log('test failed for unknown reasons');
			}
		});
	});

	it('update start and end dates', (done) => {
		chai.request('http://localhost:4000').post('/trainee/editDates/' + userId).send(updateDates).end((err, res) => {
			if (res.status == '200'){
				console.log(res.body);
				done();
			}
			else if (res.status == '404' || '400'){
				console.log(res.body);
			}
			else {
				console.log('test failed for unknown reasons');
			}
		});
	});

	describe('/send-email', () => {
		before((done) => {
			chai.request('http://localhost:4000').post('/trainee/send-email/').send({'trainee_email': userEmail}).end((err, res) => {
				if(res.body.email === "Email Sent"){
					console.log('Email sent to ' + userEmail);
					done();
				}
				else{
					throw new Error("Expected email sent but got something else, add console.log(res), to see full res");
				}
			});
		});

		context('getting token and updating trainee', () => {
			it('getting trainee details', (done) => {
				chai.request('http://localhost:4000').get('/trainee/'+ userId).end((err, res) => {
					token = res.body.trainee_password_token;
					newPassword.trainee_password = CryptoJS.AES.encrypt(newPassword.trainee_password, '3FJSei8zPx').toString();
					console.log(token);
					console.log(newPassword);
					chai.request('http://localhost:4000').post('/trainee/update-password/'+ token).send(newPassword).end((err, res) => {
						if(res.body === 'Password updated!'){
							console.log("password has been updated for trainee");
							done();
						}
						else{
							throw new Error('Unexpected or incorrect result trainee');
						}
					});
				});
			});
		});

		context('getting token and resetting password',function(){
			it('getting trainee details', (done) => {
				chai.request('http://localhost:4000').get('/trainee/'+ userId).end((err, res) => {
					token = res.body.trainee_password_token;
					chai.request('http://localhost:4000').get('/trainee/reset/'+ token).end((err, res) => {
						if(res.status === 200) {
							console.log(res.body);
							done();
						}
					});
				});
			});
		});
	});

	it('test sort code finder', (done) => {
		chai.request('http://localhost:4000').post('/trainee/findBank/').send({'sort_code': '090921'}).end((err, res) =>{
			if (res.status == '200'){
				console.log(res.body);
				done();
			}
			else if (res.status == '400'){
				console.log(res.body);
			}
			else {
				console.log('test failed for unknown reasons');
			}
		});
	});

	it('test adding bank', (done) => {
		chai.request('http://localhost:4000').post('/trainee/addBank/').send({'SortCode': '090921', 'BankName': 'Bank', 'Branch': 'SuperBranch'}).end((err, res) =>{
			if (res.status == '200'){
				console.log(res.body);
				done();
			}
			else if (res.status == '205'){
				console.log(res.body);
			}
			else {
				console.log('test failed for unknown reasons');
			}
		});
	});
});
