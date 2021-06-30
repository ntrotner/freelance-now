import { POST } from '/http_requests.js';
import { callSnackbar, closeSnackbar } from '/snackbar.js';

/**
 * send login credentials
 *
 * @param email
 * @param password
 */
export function sendLogin(email, password) {
  closeSnackbar();
  POST('/api/login',
    [{name: 'Content-Type', value: 'application/json'}],
    {email, password},
    successfulLogin,
    (msg) => {
      sessionStorage.clear();
      error(msg);
    }
  );
}

/**
 * send registration as developer/client
 *
 * @param email
 * @param username
 * @param password
 * @param type
 */
export function sendRegistration(email, username, password, type) {
  closeSnackbar();
  POST(type === 'entwickler' ? '/api/newDeveloper' : '/api/newClient',
    [{name: 'Content-Type', value: 'application/json'}],
    {username, email, password},
    successfulLogin,
    (msg) => {
      sessionStorage.clear();
      error(msg);
    }
  );
}

/**
 * change attributes of profile
 *
 * @param attribute
 * @param successful
 * @param failed
 */
export function changeAttribute(attribute, successful, failed) {
  POST('/api/updateSettings',
    [{name: 'Content-Type', value: 'application/json'}],
    attribute,
    (msg) => {
      callSnackbar('Einstellung übernommen!');
      saveSessionData(msg);
      try {
        successful();
      } catch {
        console.log('No Function Defined');
      }
    },
    (msg) => {
      error(msg);
      failed();
    }
  );
}

/**
 * check if user is paypal verified
 *
 * @param email
 * @param success
 * @param failed
 */
export function checkPayPalVerification(email, success, failed) {
  POST('/api/isPayPalConnected',
    [{name: 'Content-Type', value: 'application/json'}],
    {email},
    (msg) => {
      success(msg);
    },
    (msg) => {
      error(msg);
      failed(msg);
    }
  );
}

/**
 * redirect to home on successful login
 *
 * @param sessionData
 */
export function successfulLogin(sessionData) {
  saveSessionData(sessionData);
  redirectHome();
}

/**
 * update session data in browser
 *
 * @param sessionData
 */
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
