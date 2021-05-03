import path = require('path');
import { isAuthenticated, isClient, isInContract, unauthenticate } from '../server/user_authentication/session_manager';

const home = (req, res, fct) => fct('/home/home.html', res);
const login = (req, res, fct) => fct('/login/login.html', res);
const register = (req, res, fct) => fct('/register/register.html', res);
const logout = (req, res, fct) => fct('/logout/logout.html', res);
const welcome = (req, res, fct) => fct('/welcome/welcome.html', res);
const settings = (req, res, fct) => fct('/settings/settings.html', res);
const chat = (req, res, fct) => fct('/chat/chat.html', res);
const profile = (req, res, fct) => fct('/profile/profile.html', res);
const newContract = (req, res, fct) => fct('/newContract/newContract.html', res);
const contracts = (req, res, fct) => fct('/contracts/contracts.html', res);
const contract = (req, res, fct) => fct('/contract/contract.html', res);
const error = (req, res, fct) => fct('/error/error.html', res);

const homecss = (req, res, fct) => fct('/home/home.css', res);
const registercss = (req, res, fct) => fct('/register/register.css', res);
const logincss = (req, res, fct) => fct('/login/login.css', res);
const settingscss = (req, res, fct) => fct('/settings/settings.css', res);
const defaultcss = (req, res, fct) => fct('/general/default.css', res);
const welcomecss = (req, res, fct) => fct('/welcome/welcome.css', res);
const chatcss = (req, res, fct) => fct('/chat/chat.css', res);
const profilecss = (req, res, fct) => fct('/profile/profile.css', res);
const snackbarcss = (req, res, fct) => fct('/general/snackbar.css', res);
const newContractcss = (req, res, fct) => fct('/newContract/newContract.css', res);
const contractcss = (req, res, fct) => fct('/contract/contract.css', res);
const contractscss = (req, res, fct) => fct('/contracts/contracts.css', res);

const welcometoppng = (req, res, fct) => fct('/general/welcome-top.png', res);

const http_requests = (req, res, fct) => fct('/scripts/http_requests.js', res);
const session_manager = (req, res, fct) => fct('/scripts/session_manager.js', res);
const snackbar = (req, res, fct) => fct('/scripts/snackbar.js', res);
const check_session = (req, res, fct) => fct('/scripts/check_session.js', res);
const chatjs = (req, res, fct) => fct('/scripts/chat.js', res);
const profilejs = (req, res, fct) => fct('/scripts/profile.js', res);
const contractsjs = (req, res, fct) => fct('/scripts/contracts.js', res);
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

function checkChat(req, res, _) {
  if (isAuthenticated(req)) {
    chat(req, res, sendFile);
  } else {
    redirect('/', res);
  }
}

function checkProfile(req, res, _) {
  if (isAuthenticated(req) && req.query.email) {
    profile(req, res, sendFile);
  } else {
    redirect('/', res);
  }
}

function createContract(req, res, _) {
  if (isAuthenticated(req) && isClient(req)) {
    newContract(req, res, sendFile);
  } else {
    redirect('/', res);
  }
}

async function checkContract(req, res, _) {
  if (isAuthenticated(req) && req.query._id) {
    contract(req, res, sendFile);
  } else {
    redirect('/contracs', res);
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
  '/chat': checkChat,
  '/chat.css': chatcss,
  '/profile': checkProfile,
  '/profile.css': profilecss,
  '/create/contract': createContract,
  '/create/contract.css': newContractcss,
  '/contract': checkContract,
  '/contract.css': contractcss,
  '/contracts': contracts,
  '/contracts.css': contractscss,
  '/error': error,
  '/default.css': defaultcss,
  '/snackbar.css': snackbarcss,
  '/favicon.ico': error,
  '/http_requests.js': http_requests,
  '/session_manager.js': session_manager,
  '/snackbar.js': snackbar,
  '/check_session.js': check_session,
  '/chat.js': chatjs,
  '/profile.js': profilejs,
  '/sidebar.js': sidebar,
  '/contracts.js': contractsjs,
}

export function getRoute(route: string, req, res): void {
  routes[req.params['0']] ? routes[req.params['0']](req, res, sendFile) : redirect('/error', res)
}
