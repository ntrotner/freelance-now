import { IClient } from '../database/interfaces/client_interface';
import { IDeveloper } from '../database/interfaces/developer_interface';

export function setUserCredentials(req, res, user: IClient | IDeveloper) {
  req.session._id = user._id;
  req.session.email = user.email;
  req.session.password_hash = user.password_hash;
  res.sendStatus(200);
}

export function resetUserCredentials(req, res, code: number, message: string) {
  delete req.session._id;
  delete req.session.email;
  delete req.session.password_hash;
  res.status(code).send(message);
}
