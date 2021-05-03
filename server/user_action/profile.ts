import { isEMail } from '../components/validator';
import { error } from '../routes';
import { findUser } from '../user_authentication/user_control';

export async function getProfile(req, res) {
  if (!isEMail(req.body.email)) return error(req, res, 'Falsche E-Mail');

  const foundUser = await findUser({email: req.body.email});
  if (!foundUser) return error(req, res, 'Kein Nutzer gefunden');

  const response = {
    username: foundUser.username,
    email: foundUser.email,
    about: foundUser.about
  }

  if (foundUser['stack']) response['stack'] = foundUser['stack'];
  if (foundUser['git']) response['git'] = foundUser['git'];
  response['type'] = foundUser['stack'] ? 'dev' : 'client';

  res.status(200).json(response);
}
