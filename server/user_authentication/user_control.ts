import { Model } from 'mongoose';
import { IDeveloper } from '../database/interfaces/developer_interface';
import { IClient } from '../database/interfaces/client_interface';
import { hashPassword, verifyPassword } from './password';
import { Client } from '../database/schemas/client_schema';
import { Developer } from '../database/schemas/developer_schema';
import { isEMail, isValidName, isValidPassword, validInputLogin } from '../components/validator';
import { resetUserCredentials, setUserCredentials } from './session_manager';
import { error } from '../routes';

/**
 * check in database if email address already is registered
 *
 * @param email
 * @param model
 */
export async function existsEMail(email, model: Model<IClient> | Model<IDeveloper>): Promise<{ exists: boolean, user: IClient | IDeveloper }> {
  const foundModel = await model.findOne({email});
  return {exists: !!foundModel, user: foundModel || null};
}

/**
 * check if email is used by another user
 *
 * @param email
 */
export async function existsAnyEMail(email): Promise<boolean> {
  const emailCheckClient = await existsEMail(email, Client);
  const emailCheckDev = await existsEMail(email, Developer);

  return emailCheckClient.exists || emailCheckDev.exists;
}

/**
 * finds a user through a property
 *
 * @param property
 */
export async function findUser(property: Object): Promise<IDeveloper | IClient> {
  let temp: IDeveloper | IClient = await Developer.findOne(property);
  if (!temp) temp = await Client.findOne(property);
  return temp;
}

/**
 * create an user in the selected collection
 *
 * @param req
 * @param res
 * @param model
 * @param options
 */
export async function createUser(req, res, Model: Model<IDeveloper> | Model<IClient>, options: Object) {
  if (await existsAnyEMail(req.body.email)) return resetUserCredentials(req, res, 400, 'E-Mail existiert schon');

  const passwordHash = await hashPassword(req.body.password);
  const newModel = new Model({
    username: req.body.username,
    passwordHash,
    email: req.body.email,
    ...options
  });

  await newModel.save();
  return setUserCredentials(req, res, newModel);
}

/**
 * validate login data and return data corresponding to the result
 *
 * @param req
 * @param res
 */
export async function loginUser(req, res): Promise<void> {
  if (!validInputLogin(req.body)) return resetUserCredentials(req, res, 400, 'Ungeeignete Eingabe');

  let foundUser;
  if (req.body.email) foundUser = await findUser({email: req.body.email});

  if (!foundUser) return resetUserCredentials(req, res, 401, 'Nutzer nicht gefunden');
  if (!req.body.password) return resetUserCredentials(req, res, 401, 'Passwort nicht gueltig');

  verifyPassword(foundUser.passwordHash, req.body.password)
    .then((isVerified) => {
      if (isVerified) setUserCredentials(req, res, foundUser);
      else resetUserCredentials(req, res, 401, 'Falsches Passwort');
    })
    .catch(() => resetUserCredentials(req, res, 400, 'Unerwartetes Problem'));
}

/**
 * update settings of a user
 *
 * @param req
 * @param res
 */
export async function updateSettings(req, res): Promise<void> {
  const foundUser = await findUser({email: req.session.email});

  if (!foundUser) resetUserCredentials(req, res, 401, 'Nutzer Ungültig');

  switch (Object.keys(req.body)[0]) {
  case 'username':
    if (isValidName(req.body.username)) {
      foundUser.username = req.body.username;
      const updatedUser = await foundUser.save();
      setUserCredentials(req, res, updatedUser);
    } else error(req, res, 'Ungültiger Name');
    break;
  case 'email':
    if (!(await existsAnyEMail(req.body.email)) && isEMail(req.body.email)) {
      foundUser.email = req.body.email;
      const updatedUser = await foundUser.save();
      setUserCredentials(req, res, updatedUser);
    } else error(req, res, isEMail(req.body.email) ? 'E-Mail vergeben' : 'E-Mail ungültig');
    break;
  case 'password':
    if (isValidPassword(req.body.password)) {
      foundUser.passwordHash = await hashPassword(req.body.password);
      const updatedUser = await foundUser.save();
      setUserCredentials(req, res, updatedUser);
    } else error(req, res, 'Passwort ungültig');
    break;
  case 'about':
    if (typeof String(req.body.about) === 'string') {
      foundUser.about = String(req.body.about);
      const updatedUser = await foundUser.save();
      setUserCredentials(req, res, updatedUser);
    } else error(req, res, 'Eingabe Ungültig');
    break;
  case 'git':
    if (typeof foundUser['git'] === 'string' && typeof String(req.body.git) === 'string') {
      foundUser['git'] = String(req.body.git);
      const updatedUser = await foundUser.save();
      setUserCredentials(req, res, updatedUser);
    } else error(req, res, 'Eingabe Ungültig');
    break;
  case 'stack':
    if (typeof foundUser['stack'] === 'object') {
      foundUser['stack'] = req.body.stack;
      const updatedUser = await foundUser.save();
      setUserCredentials(req, res, updatedUser);
    } else error(req, res, 'Eingabe Ungültig');
    break;
  }
}
