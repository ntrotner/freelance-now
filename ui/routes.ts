import path = require('path');
import { isAuthenticated, unauthenticate } from '../server/user_authentication/session_manager';

const home = (req, res, fct) => fct('/home/home.html', res);
const login = (req, res, fct) => fct('/login/login.html', res);
const register = (req, res, fct) => fct('/register/register.html', res);
const logout = (req, res, fct) => fct('/logout/logout.html', res);
const welcome = (req, res, fct) => fct('/welcome/welcome.html', res);
const settings = (req, res, fct) => fct('/settings/settings.html', res);
const error = (req, res, fct) => fct('/error/error.html', res);

const homecss = (req, res, fct) => fct('/home/home.css', res);
const registercss = (req, res, fct) => fct('/register/register.css', res);
const logincss = (req, res, fct) => fct('/login/login.css', res);
const settingscss = (req, res, fct) => fct('/settings/settings.css', res);
const defaultcss = (req, res, fct) => fct('/general/default.css', res);
const welcomecss = (req, res, fct) => fct('/welcome/welcome.css', res);
const snackbarcss = (req, res, fct) => fct('/general/snackbar.css', res);

const welcometoppng = (req, res, fct) => fct('/general/welcome-top.png', res);


const http_requests = (req, res, fct) => fct('/scripts/http_requests.js', res);
const session_manager = (req, res, fct) => fct('/scripts/session_manager.js', res);
const snackbar = (req, res, fct) => fct('/scripts/snackbar.js', res);
const check_session = (req, res, fct) => fct('/scripts/check_session.js', res);
const sidebar = (req, res, fct) => fct('/components/sidebar.js', res);

const sendFile = (pathFile, res) => res.sendFile(path.join(__dirname + pathFile));
const redirect = (pathFile, res) => res.redirect(302, pathFile)

function isAuthorized(req, res, _) {
  if (isAuthenticated(req)) home(req, res, sendFile)
  else welcome(req, res, sendFile)
}

function checkLogin(req, res, _) {
  if (isAuthenticated(req)) redirect('/', res)
  else login(req, res, sendFile)
}

function logoutUser(req, res, _) {
  if (isAuthenticated(req)) {
    req = unauthenticate(req);
    logout(req, res, sendFile);
  } else {
    redirect('/', res);
  }
}

function checkSettings(req, res, _) {
  if (isAuthenticated(req)) settings(req, res, sendFile)
  else redirect('/', res)

}

function registerPage(req, res, _) {
  if (isAuthenticated(req)) {
    redirect('/', res);
  } else {
    register(req, res, sendFile);
  }
}

const routes = {
  '/': isAuthorized,
  '/home.css': homecss,
  '/login': checkLogin,
  '/login.css': logincss,
  '/logout': logoutUser,
  '/register': registerPage,
  '/register?type=entwickler': registerPage,
  '/register?type=auftraggeber': registerPage,
  '/register.css': registercss,
  '/welcome.css': welcomecss,
  '/welcome-top.png': welcometoppng,
  '/settings': checkSettings,
  '/settings.css': settingscss,
  '/error': error,
  '/default.css': defaultcss,
  '/snackbar.css': snackbarcss,
  '/favicon.ico': error,
  '/http_requests.js': http_requests,
  '/session_manager.js': session_manager,
  '/snackbar.js': snackbar,
  '/check_session.js': check_session,
  '/sidebar.js': sidebar
}

export function getRoute(route: string, req, res): void {
  routes[route] ? routes[route](req, res, sendFile) : redirect('/error', res)
}
