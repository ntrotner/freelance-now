import { isAuthenticated, isClient, unauthenticate } from '../server/user_authentication/session_manager';
import {
  chat,
  chatcss, contract,
  contractcss,
  contracts, contractscss,
  defaultcss, home, homecss,
  login, logincss,
  logout,
  newContract, newContractcss, profile, profilecss,
  registercss,
  search, searchcss,
  settingscss,
  snackbarcss, welcome, welcomecss,
  settings, register
} from './pages';
import {
  chatjs,
  check_session,
  contractsjs,
  http_requests,
  profilejs,
  session_manager,
  snackbar
} from './scripts';
import { sidebar } from './components';
import path = require('path');

const sendFile = (pathFile, res) => res.sendFile(path.join(__dirname + pathFile));
const redirect = (pathFile, res) => res.redirect(302, pathFile);
const error = (req, res, fct) => fct('/error/error.html', res);

function isAuthorized(req, res, _) {
  if (isAuthenticated(req)) home(req, res, sendFile);
  else welcome(req, res, sendFile);
}

function checkLogin(req, res, _) {
  if (isAuthenticated(req)) redirect('/', res);
  else login(req, res, sendFile);
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
  if (isAuthenticated(req)) settings(req, res, sendFile);
  else redirect('/', res);
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

async function checkSearch(req, res, _) {
  if (isAuthenticated(req)) {
    search(req, res, sendFile);
  } else {
    redirect('/', res);
  }
}

const htmlRoutes = {
  '/': isAuthorized,
  '/login': checkLogin,
  '/logout': logoutUser,
  '/register': registerPage,
  '/register?type=entwickler': registerPage,
  '/register?type=auftraggeber': registerPage,
  '/settings': checkSettings,
  '/search': checkSearch,
  '/chat': checkChat,
  '/profile': checkProfile,
  '/create/contract': createContract,
  '/contract': checkContract,
  '/contracts': contracts,
  '/error': error
};

const cssRoutes = {
  '/home.css': homecss,
  '/login.css': logincss,
  '/register.css': registercss,
  '/welcome.css': welcomecss,
  '/settings.css': settingscss,
  '/search.css': searchcss,
  '/chat.css': chatcss,
  '/profile.css': profilecss,
  '/create/contract.css': newContractcss,
  '/contract.css': contractcss,
  '/contracts.css': contractscss,
  '/default.css': defaultcss,
  '/snackbar.css': snackbarcss
};

const jsRoutes = {
  '/http_requests.js': http_requests,
  '/session_manager.js': session_manager,
  '/snackbar.js': snackbar,
  '/check_session.js': check_session,
  '/chat.js': chatjs,
  '/profile.js': profilejs,
  '/sidebar.js': sidebar,
  '/contracts.js': contractsjs
};

const etcRoutes = {
  '/favicon.ico': error
};

const allRoutes = {
  ...htmlRoutes, ...cssRoutes, ...jsRoutes, ...etcRoutes
};

export function getRoute(route: string, req, res): void {
  allRoutes[req.params['0']] ? allRoutes[req.params['0']](req, res, sendFile) : redirect('/error', res);
}
