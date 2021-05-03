import { IClient } from '../database/interfaces/client_interface';
import { IDeveloper } from '../database/interfaces/developer_interface';
import { sendSessionStorage } from '../user_action/credentials';
import { Contract } from '../database/schemas/contracts_schema';
import { Schema, Types } from 'mongoose';


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
  req.session.password_hash = user.password_hash;
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
  delete req.session.password_hash;
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
  res.status(code ? code : 400).send(message ? message : '');
}

/**
 * check if user's session is authenticated
 *
 * @param req
 */
export function isAuthenticated(req): boolean {
  return req.session._id && req.session.email && req.session.password_hash && req.session.type;
}

export function isClient(req): boolean {
  return req.session.type === 'client'
}

export async function isInContract(req, _id) {
  if (req.session.type === 'client') {
    console.log({_id: Types.ObjectId(_id), client: Types.ObjectId(req.session._id)})
    return Contract.findOne({_id: Types.ObjectId(_id), client: Types.ObjectId(req.session._id)});
  } else {
    return Contract.findOne({_id: Types.ObjectId(_id), developer: Types.ObjectId(req.session._id)});
  }
}
