import { createDeveloper } from './user_authentication/developer_control';
import { createClient } from './user_authentication/client_control';
import { loginUser, updateSettings } from './user_authentication/user_control';
import { sendSessionStorage } from './user_action/credentials';


/**
 * simple health check of server
 *
 * @param req
 * @param res
 */
function healthCheck(req, res) {
  res.sendStatus(200);
}

/**
 * default status for error
 *
 * @param req
 * @param res
 * @param message
 */
export function error(req, res, message = 'Fehler') {
  res.status(404).send(message);
}

const getRoutes = {
  '/api/health': healthCheck,
  '/api/sessionCredentials': sendSessionStorage
}

/**
 * executes route of get path of express
 *
 * @param route
 * @param req
 * @param res
 */
export function getRoute(route: string, req, res): void {
  (getRoutes[route] ? getRoutes[route] : error)(req, res);
}

const postRoutes = {
  '/api/newDeveloper': createDeveloper,
  '/api/newClient': createClient,
  '/api/login': loginUser,
  '/api/updateSettings': updateSettings
}

/**
 * executes route of post path of express
 *
 * @param route
 * @param req
 * @param res
 */
export function postRoute(route: string, req, res): void {
  (postRoutes[route] ? postRoutes[route] : error)(req, res);
}
