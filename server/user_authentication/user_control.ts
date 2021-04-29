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
  return {exists: !!foundModel, user: !!foundModel ? foundModel : null}
}

export async function existsAnyEMail(email) {
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
export async function createUser(req, res, model: Model<IDeveloper> | Model<IClient>, options: Object) {
  if (existsAnyEMail(req.body.email)) return resetUserCredentials(req, res, 400, 'E-Mail existiert schon');

  const password_hash = await hashPassword(req.body.password);
  const newModel = new model({
    username: req.body.username,
    password_hash,
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

  verifyPassword(foundUser.password_hash, req.body.password)
      .then((isVerified) => {
        if (isVerified) setUserCredentials(req, res, foundUser)
        else resetUserCredentials(req, res, 401, 'Falsches Passwort')
      })
      .catch(() => resetUserCredentials(req, res, 400, 'Unerwartetes Problem'))
}

export async function updateSettings(req, res): Promise<void> {
  let foundUser = await findUser({email: req.session.email});

  if (!foundUser) resetUserCredentials(req, res, 401, 'Nutzer Ungültig');

  switch (Object.keys(req.body)[0]) {
    case 'username':
      if (isValidName(req.body.username)) {
        foundUser.username = req.body.username
        const updatedUser = await foundUser.save();
        setUserCredentials(req, res, updatedUser);
      } else error(req, res, 'Ungültiger Name')
      break;
    case 'email':
      if (!(await existsAnyEMail(req.body.email)) && isEMail(req.body.email)) {
        foundUser.email = req.body.email
        const updatedUser = await foundUser.save();
        setUserCredentials(req, res, updatedUser);
      } else error(req, res, isEMail(req.body.email) ? 'E-Mail vergeben' : 'E-Mail ungültig')
      break;
    case 'password':
      if (isValidPassword(req.body.password)) {
        foundUser.password_hash = await hashPassword(req.body.password);
        const updatedUser = await foundUser.save();
        setUserCredentials(req, res, updatedUser);
      } else error(req, res, 'Passwort ungültig')
      break;
  }


}
