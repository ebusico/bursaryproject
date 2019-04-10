import { data as trainee } from 'mockTrainee.js';

const trainee_endpoint = 'http://localhost:4000/trainee/';

module.exports = {
	get: jest.fn((url) => {
	switch (url) {
	case trainee_endpoint:
	return Promise.resolve({
		data: trainee
		});
	}
	})
};