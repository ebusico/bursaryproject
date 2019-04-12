import { authService } from './authService';

export function handleResponse (response) {
	return response.text().then( text => {
	const data = text && JSON.parse(text);
	if (!response.ok){
		if ([401, 403].indexOf(response.status) !== -1){
		authService.logout();
		window.location.hostname.reload(true);
		}
		// auto logout if a 401 or 403 Foribidden response
		const error = (data && data.message) || response.statusText;
		return Promise.reject(error);
		}
		return data; 
	});
}