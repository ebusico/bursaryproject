import { BehaviorSubject } from 'rxjs';

const items = localStorage.getItem('currentUser');
const currentUserSubject = new BehaviorSubject(JSON.parse(items));

export const authService = {
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};


function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}