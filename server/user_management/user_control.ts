import { Model } from 'mongoose';
import { IDeveloper } from '../database/interfaces/developer_interface';
import { IClient } from '../database/interfaces/client_interface';
import { hashPassword, verifyPassword } from './password';
import { Client } from '../database/schemas/client_schema';
import { Developer } from '../database/schemas/developer_schema';
import { validInputLogin } from '../components/validator';
import { resetUserCredentials, setUserCredentials } from './session_manager';


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
 * @param username
 * @param password
 * @param email
 * @param model
 * @param options
 */
export async function createUser(username: string, password: string, email: string, model: Model<IDeveloper> | Model<IClient>, options: Object):
    Promise<{ ok: boolean, payload: IClient | IDeveloper | string }> {
  const emailCheckClient = await existsEMail(email, Client);
  const emailCheckDev = await existsEMail(email, Developer);

  if (emailCheckClient.exists || emailCheckDev.exists) return {ok: false, payload: 'E-Mail existiert schon'}

  const password_hash = await hashPassword(password);
  const newModel = new model({
    username,
    password_hash,
    email,
    ...options
  });

  await newModel.save();
  return {ok: true, payload: newModel};
}

/**
 * validate login data and return data corresponding to the result
 *
 * @param req
 * @param res
 */
export async function loginUser(req, res): Promise<void> {
  if (!validInputLogin(req.body)) return resetUserCredentials(req, res, 406, 'Ungeeignete Eingabe');

  let foundUser;
  if (req.body.email) foundUser = await findUser({email: req.body.email})

  if (!foundUser) return resetUserCredentials(req, res, 404, 'Nutzer nicht gefunden')
  if (!req.body.password) return resetUserCredentials(req, res, 404, 'Passwort nicht gueltig')

  verifyPassword(foundUser.password_hash, req.body.password)
      .then((isVerified) => {
        if (isVerified) setUserCredentials(req, res, foundUser)
        else res.status(404).send('Falsches Passwort')
      })
      .catch(() => resetUserCredentials(req, res, 500, 'Unerwartetes Problem'))
}
