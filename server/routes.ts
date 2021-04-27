import { createDeveloper } from './user_management/developer_control';
import { createClient } from './user_management/client_control';
import { loginUser } from './user_management/user_control';

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
 */
function error(req, res) {
  res.sendStatus(404);
}

const getRoutes = {
  '/api/health': healthCheck
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
  '/api/login': loginUser
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
