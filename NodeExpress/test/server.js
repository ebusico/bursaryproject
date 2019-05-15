'use strict'

let user = require('../models/staff.js');
var CryptoJS = require("crypto-js");

var expect = require('chai').expect,
	request = require('supertest'),
	should = require('chai').should(),
	//should = require('should'),
	server = require('../server.js');
var chai = require('chai');
var chaiHttp = require('chai-http');

var assert = require('assert'),
	http = require('http');
	
let Trainee = require('../trainee.model');
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
			res.body.should.be.a('array');
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
				console.log(res.status);
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
});

describe('set userId', () => {
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

describe('/send-email-staff', () => {
	it ('Should send an email', (done) => {
		let email = "StaffEmail@aol.com";
		chai.request('http://localhost:4000').post('/admin/send-email').send(email).end((err, res) => {
			console.log('Email has been sent');
			done();
		});
	});
	});
	
describe('/send-email', () => {
	it ('Should send an email', (done) => {
		chai.request('http://localhost:4000').post('/trainee/send-email').send(addUser.trainee_email).end((err, res) => {
			console.log('Email has been sent');
			done();
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
describe('/update-password', () => {
	it('should update the trainee password', (done) => {
		chai.request('http://localhost:4000').post('/trainee/update-password/'+userId).send(newPassword).end((err, res) => {
			res.status.should.be.equal(200);
			console.log('trainee password has changed');
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
		beforeEach((done) => {
			user.remove({}, (err) => {
				console.log(err);
				done();
			})
		});
		
describe('/POST Register', function () {
	it('Should Register user account', function (done) {
		chai.request('http://localhost:4000').post('/addUser/postman').send(register_details).end((err, res) => {
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
		chai.request('http://localhost:4000').post('/admin/staff/:id').end((err, res) => {
			res.status.should.be.equal(200);
			console.log('Staff list shows');
			done();
		});
	});
});

describe('delete user via id', () => {
	it('Should delete account',  (done) => {
		let delId;

	// 	chai.request('http://localhost:4000').post('/trainee/add').set('content-type', 'application/json').send(deleteUser).end((err, res) => {
	// 		console.log(res.status);
	// 	 if (res.status == '200'){
	// 		 console.log('Account has been created');
	// 	 }
	// 	 else{
	// 		 console.log((`Expected 200 but got ${res}. error is ${err}`));
	// 	 }
	// });
	
	chai.request('http://localhost:4000').get('/trainee/').end((err, res) => {
		let i = 0;
		 while(i < res.body.length){
		 	if(res.body[i].trainee_email == deleteUser.trainee_email){
				 console.log("email : "+ res.body[i].trainee_email);
				 console.log("id : "+res.body[i]._id);
				 delId = res.body[i]._id;
				 break;
			 }
			i++;
		 }
		})

		chai.request('http://localhost:4000').get('/trainee/delete/'+ delId).end((err, res) => {
			res.should.have.status(200);
			console.log('the dummy trainee data has now been deleted.');
			done();
		});
	});
})