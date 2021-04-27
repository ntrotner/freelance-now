import { createUser } from './user_control';
import { Developer } from '../database/schemas/developer_schema';
import { validInputCreateUser } from '../components/validator';


/**
 * add new developer to the database
 *
 * @param req
 * @param res
 */
export async function createDeveloper(req, res) {
  if (validInputCreateUser(req.body)) {
    createUser(req.body.username,
        req.body.password,
        req.body.email,
        Developer,
        {})
        .then((newDev) => {
          res.status(201).json(newDev)
        })
        .catch(() => {
          res.sendStatus(400);
        });
  } else {
    res.sendStatus(400);
  }
}
