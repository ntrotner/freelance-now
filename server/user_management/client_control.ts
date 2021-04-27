import { createUser } from './user_control';
import { Client } from '../database/schemas/client_schema';
import { validInputCreateUser } from '../components/validator';

/**
 * create new input in database for a client
 *
 * @param req
 * @param res
 */
export async function createClient(req, res) {
  if (validInputCreateUser(req.body)) {
    createUser(req.body.username,
        req.body.password,
        req.body.email,
        Client,
        {})
        .then((newUser) => {
          res.status(201).json(newUser)
        })
        .catch(() => {
          res.sendStatus(400);
        });
  }
}
