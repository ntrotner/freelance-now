const pathToScripts = '/scripts';

export const httpRequests = (req, res, fct) => fct(pathToScripts + '/http_requests.js', res);
export const sessionManager = (req, res, fct) => fct(pathToScripts + '/session_manager.js', res);
export const snackbar = (req, res, fct) => fct(pathToScripts + '/snackbar.js', res);
export const checkSession = (req, res, fct) => fct(pathToScripts + '/check_session.js', res);
export const chatjs = (req, res, fct) => fct(pathToScripts + '/chat.js', res);
export const profilejs = (req, res, fct) => fct(pathToScripts + '/profile.js', res);
export const contractsjs = (req, res, fct) => fct(pathToScripts + '/contracts.js', res);
