import { Contract } from '../database/schemas/contracts_schema';
import { findUser } from '../user_authentication/user_control';
import { isASCII, isEMail } from '../components/validator';
import { error } from '../routes';
import { isAuthenticated, isClient, isInContract } from '../user_authentication/session_manager';
import { IContract } from '../database/interfaces/contract_interface';
import { Types } from 'mongoose';

export async function getContractsMeta(req, res) {
  let foundUser;
  if (!isAuthenticated(req)) return error(req, res, 'Nicht Authentifiziert');
  if (!isEMail(req.body.email)) return error(req, res, 'E-Mail nicht gültig');
  foundUser = await findUser({email: req.body.email});

  if (!foundUser) return error(req, res, 'Nutzer nicht gefunden')
  const client = foundUser.git ? req.session._id : foundUser._id
  const developer = foundUser.git ? foundUser._id : req.session._id

  const foundContract = await Contract.find({client, developer})
  if (!foundContract) return error(req, res, 'Kein Auftrag gefunden')

  let amountOfRatings = 0;
  console.log(foundContract)

  const rating = foundContract.map((contract) =>
      contract.rating ?
          [contract.rating.communication, contract.rating.speed, contract.rating.quality]
          : undefined)
      .filter((rating) => rating)
      .reduce((prev, next) => {
        amountOfRatings += 1;
        return [prev[0] + next[0], prev[1] + next[1], prev[2] + next[2]]
      }, [0, 0, 0])

  console.log(foundContract.map((contract) =>
      contract.rating ?
          [contract.rating.communication, contract.rating.speed, contract.rating.quality]
          : undefined))

  console.log(rating)
  if (amountOfRatings === 0) return res.status(200).json({rating: [0, 0, 0], amount: 0})

  res.status(200).json({rating: rating.map((number) => number / amountOfRatings), amount: amountOfRatings});
}

export async function getPersonalContracts(req, res) {
  if (!isAuthenticated(req)) return error(req, res, 'Nicht Authentifiziert')

  let allContracts: IContract[];
  if (req.session.type === 'client') allContracts = await Contract.find({client: req.session._id})
  else allContracts = await Contract.find({developer: req.session._id})


  res.status(200).json(allContracts.map((contract) => {
    let participant: Types.ObjectId | string = req.session.type === 'client' ? contract.developer : contract.client
    if (!participant) participant = 'Kein Nutzer'
    return {
      _id: contract._id,
      name: contract.name,
      participant,
      reward: contract.reward,
      isDone: contract.isDone
    }
  }))

}

export async function createContract(req, res) {
  if (!isAuthenticated(req) || !isClient(req)) return error(req, res, 'Nutzer darf kein Auftrag erstellen');

  if (!req.body.title || req.body.title.length < 4 || !isASCII(req.body.title)) return error(req, res, 'Titel unzulässig');
  if (isNaN(req.body.reward) || req.body.reward < 0) return error(req, res, 'Entlohnung unzulässig');
  if (isNaN((new Date(req.body.startDate).getMilliseconds()))) return error(req, res, 'Start Datum unzulässig');
  if (isNaN((new Date(req.body.endDate).getMilliseconds()))) return error(req, res, 'End Datum unzulässig');
  if (!req.body.description || req.body.description.length < 4) return error(req, res, 'Beschreibung unzulässig');
  if (!req.body.stack || req.body.stack.length < 0) return error(req, res, 'Beschreibung unzulässig');

  const newContract = new Contract({
    client: req.session._id,
    name: req.body.title,
    reward: req.body.reward,
    starting_date: new Date(req.body.startDate),
    end_date: new Date(req.body.endDate),
    details: {
      stack: req.body.stack,
      description: req.body.description,
      stage: 'Kein Auftragnehmer'
    }
  });

  await newContract.save();

  res.status(200).send('Erstellt');
}


export async function getContractInformation(req, res) {
  if (!isAuthenticated(req) || !req.body._id) return error(req, res, 'Nicht Authentifiziert');

  let foundContract = await isInContract(req, req.body._id);
  if (!foundContract) foundContract = await Contract.findOne({_id: req.body._id});

  res.status(200).json(foundContract);
}

export async function finishContract(req, res) {
  if (req.body.communication <= 0 || req.body.speed <= 0 || req.body.quality <= 0) return error(req, res, 'Invalide Eingabe')

  if (!isAuthenticated(req) || !req.body._id || !isClient(req)) return error(req, res, 'Nicht Authentifiziert');

  let foundContract = await isInContract(req, req.body._id);
  if (!foundContract) return error(req, res, 'Interner Fehler');

  if (foundContract.developer && foundContract.isDone) return error(req, res, 'Der Auftrag ist schon abgeschlossen')

  if (!foundContract.developer) return error(req, res, 'Ohne ein Entwickler kann kein Auftrag abgeschlossen werden')

  foundContract.isDone = true;
  foundContract.rating.communication = Number(req.body.communication)
  foundContract.rating.speed = Number(req.body.speed)
  foundContract.rating.quality = Number(req.body.quality)

  console.log(foundContract);
  foundContract.markModified('rating.communication');
  foundContract.markModified('rating.speed');
  foundContract.markModified('rating.quality');

  await foundContract.save()
  res.status(200).send('Abgeschlossen')
}

export async function selectDeveloper(req, res) {
  if (!isAuthenticated(req) || !req.body._id || !isClient(req)) return error(req, res, 'Nicht Authentifiziert');

  let foundContract = await isInContract(req, req.body._id);
  if (!foundContract) return error(req, res, 'Interner Fehler');

  const foundUser = await findUser({email: req.body.email});
  if (!foundUser) return error(req, res, 'Interner Fehler');

  const foundDeveloper = foundContract.potentialDevelopers.find((dev) =>
      dev.email === req.body.email && Number(dev.reward) === Number(req.body.reward)
  )
  if (!foundDeveloper) return error(req, res, 'Entwickler nicht gefunden');

  foundContract.developer = foundUser._id;
  foundContract.reward = Number(foundDeveloper.reward);
  foundContract.potentialDevelopers = [];

  await foundContract.save();
  res.status(200).send('Ausgewählt');
}

export async function addDeveloperReward(req, res) {
  console.log(!isAuthenticated(req), !req.body._id, !req.body.email, !req.body.reward, isClient(req))
  if (!isAuthenticated(req) || !req.body._id || !req.body.email || !req.body.reward || isClient(req)) return error(req, res, 'Nicht Authentifiziert');

  let foundContract = await Contract.findOne({_id: req.body._id})
  if (!foundContract) return error(req, res, 'Interner Fehler');

  foundContract.potentialDevelopers.push({email: req.body.email, reward: req.body.reward});
  await foundContract.save()
  res.status(200).send('Abgeschickt')
}
