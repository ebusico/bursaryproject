export class Auth {
	checkAuthentication(){
		return new Promise((resolve, reject) => {
			this.storage.get('token').then((value) => {
				this.token = value;
				
				let headers = new headers();
				
				headers.append('Authorization', this.token);
				
	
	});
		});
	};
	
	login(credentials){
		return new Promise((resolve, reject) => {
			let headers = new headers();
			headers.append('Content-Type', 'application/json');
			axios.post('http://localhost:4000/trainee/auth/login', Json.stringify(credentials)
			.subscribe(res => {
				
			let data = res.json();
			this.token =data.token;
			this.storage.set('token', data.token);
			resolve(data);
			resolve(res.json());
		}, (err) => {
			reject(err);
		}
		)};
	};

logout(){
	this.storage.set('token', '');
		}
}
export default Auth;