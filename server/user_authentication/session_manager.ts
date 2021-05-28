import { IClient } from '../database/interfaces/client_interface';
import { IDeveloper } from '../database/interfaces/developer_interface';
import { sendSessionStorage } from '../user_action/credentials';

/**
 * set credentials of user to identify them through the session
 *
 * @param req
 * @param res
 * @param user
 */
export function setUserCredentials(req, res, user: IClient | IDeveloper) {
  req.session._id = user._id;
  req.session.email = user.email;
  req.session.passwordHash = user.passwordHash;
  req.session.type = user['stack'] ? 'dev' : 'client';
  console.log(`User ${user.email} authenticated as ${req.session.type}`);
  sendSessionStorage(req, res);
}

/**
 * removes any authentication of user
 *
 * @param req
 */
export function unauthenticate(req) {
  console.log(`Session ${req.session.email} unauthenticated`);
  delete req.session._id;
  delete req.session.email;
  delete req.session.passwordHash;
  delete req.type;
  return req;
}

/**
 * unauthenticate user and remove session related information
 *
 * @param req
 * @param res
 * @param code
 * @param message
 */
export function resetUserCredentials(req, res, code: number, message: string) {
  unauthenticate(req);
  res.status(code || 400).send(message || '');
}

/**
 * check if user's session is authenticated
 *
 * @param req
 */
export function isAuthenticated(req): boolean {
  return req.session._id && req.session.email && req.session.passwordHash && req.session.type;
}

/**
 * check if user is client
 *
 * @param req
 */
export function isClient(req): boolean {
  return req.session.type === 'client';
}
