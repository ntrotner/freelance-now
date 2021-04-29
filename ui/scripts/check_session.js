import {GET} from "/http_requests.js";

export function checkSession(callback, error) {
    GET('/api/sessionCredentials',
        (responseJSON) => {
            sessionStorage.clear();
            Object.keys(responseJSON).forEach((key) => {
                sessionStorage.setItem(key, responseJSON[key]);
            });
            callback();
        },
        (err) => {
            console.error(err)
            sessionStorage.clear();
            error();
        }
    );
}
