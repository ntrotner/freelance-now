import { createUser } from './user_control';
import { Client } from '../database/schemas/client_schema';
import { validInputCreateUser } from '../components/validator';
import { resetUserCredentials } from './session_manager';


/**
 * create new input in database for a client
 *
 * @param req
 * @param res
 */
export async function createClient(req, res) {
  if (validInputCreateUser(req.body)) createUser(req, res, Client, {})
      .catch(() => resetUserCredentials(req, res, 400, 'Nutzer konnte nicht erstellt werden'));
  else resetUserCredentials(req, res, 400, 'Name muss mindestens 3 Zeichen enthalten\nPasswort muss mindestens 8 Zeichen enthalten');

}
