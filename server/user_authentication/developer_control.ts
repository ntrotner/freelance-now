import { createUser } from './user_control';
import { Developer } from '../database/schemas/developer_schema';
import { validInputCreateUser } from '../components/validator';
import { resetUserCredentials } from './session_manager';

/**
 * add new developer to the database
 *
 * @param req
 * @param res
 */
export async function createDeveloper(req, res) {
  if (validInputCreateUser(req.body)) {
    createUser(req, res, Developer, {})
        .catch(() => resetUserCredentials(req, res, 400, 'Nutzer konnte nicht erstellt werden'));
  } else resetUserCredentials(req, res, 400, 'Name muss mindestens 3 Zeichen enthalten\nPasswort muss mindestens 8 Zeichen enthalten');
}
