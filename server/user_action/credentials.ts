import { isAuthenticated, isClient, resetUserCredentials } from '../user_authentication/session_manager';
import { findUser } from '../user_authentication/user_control';


/**
 * send relevant session information to user
 *
 * @param req
 * @param res
 */
export async function sendSessionStorage(req, res) {
  if (!isAuthenticated(req)) return resetUserCredentials(req, res, 401, 'Nicht Authentifiziert');

  const foundUser = await findUser({
    _id: req.session._id,
    email: req.session.email,
    password_hash: req.session.password_hash
  });
  if (!foundUser) return resetUserCredentials(req, res, 401, 'Nicht Authentifiziert');

  res.status(200).json({
    username: foundUser.username,
    email: foundUser.email,
    type: isClient(req) ? 'client' : 'dev'
  });
}
