import {GET, POST} from "/http_requests.js";
import {callSnackbar, closeSnackbar} from "/snackbar.js";

export function sendLogin(email, password) {
    closeSnackbar();
    POST('/api/login',
        [{name: "Content-Type", value: "application/json"}],
        {email, password},
        successfulLogin,
        (msg) => {
            sessionStorage.clear();
            error(msg);
        }
    );
}

export function sendRegistration(email, username, password, type) {
    closeSnackbar();
    POST(type === 'entwickler' ? '/api/newDeveloper' : '/api/newClient',
        [{name: "Content-Type", value: "application/json"}],
        {username, email, password},
        successfulLogin,
        (msg) => {
            sessionStorage.clear();
            error(msg);
        }
    );
}

export function changeAttribute(attribute, successful = () => {
}, failed = () => {
}) {
    POST('/api/updateSettings',
        [{name: "Content-Type", value: "application/json"}],
        attribute,
        (msg) => {
            callSnackbar('Einstellung übernommen!');
            saveSessionData(msg);
            successful();
        },
        (msg) => {
            error(msg);
            failed();
        }
    );
}

export function successfulLogin(sessionData) {
    saveSessionData(sessionData);
    redirectHome();
}

export function saveSessionData(sessionData) {
    Object.keys(sessionData).forEach((key) => {
        sessionStorage.setItem(key, sessionData[key]);
    });
}

export function error(message) {
    callSnackbar(message);
}

export function redirectHome() {
    redirect('/');
}

export function redirectRegister() {
    redirect('/register');
}

export function unauthorize() {
    sessionStorage.clear();
    redirect('/logout');
}

export function redirect(url) {
    window.location.replace(url);
}
