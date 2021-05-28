import { Contract } from '../database/schemas/contracts_schema';
import { findUser } from '../user_authentication/user_control';
import { isASCII, isEMail } from '../components/validator';
import { error } from '../routes';
import { isAuthenticated, isClient } from '../user_authentication/session_manager';
import { IContract } from '../database/interfaces/contract_interface';
import { Types } from 'mongoose';
import { isPayPalVerficated } from './paypal';
import { IDeveloper } from '../database/interfaces/developer_interface';
import { IClient } from '../database/interfaces/client_interface';

/**
 * send rating of a developer
 *
 * @param req
 * @param res
 */
export async function getDeveloperRating(req, res) {
  if (!isAuthenticated(req)) return error(req, res, 'Nicht Authentifiziert');
  if (!isEMail(req.body.email)) return error(req, res, 'E-Mail nicht gültig');

  // find developer
  const foundUser: IDeveloper | IClient = await findUser({email: req.body.email});
  if (!foundUser) return error(req, res, 'Nutzer nicht gefunden');

  // get all contracts of developer
  const foundContract = await Contract.find({developer: foundUser._id});
  if (!foundContract) return error(req, res, 'Kein Auftrag gefunden');

  let amountOfRatings = 0;

  const rating = foundContract
  // map it to an array for reduce sum
    .map((contract) =>
    // check if contract was rated
      contract.rating
        ? [contract.rating.communication, contract.rating.speed, contract.rating.quality]
        : undefined)
  // remove undefined
    .filter((rating) => rating)
  // sum for each array position
    .reduce((prev, next) => {
      amountOfRatings += next[0] || next[1] || next[2] ? 1 : 0;
      return [prev[0] + next[0], prev[1] + next[1], prev[2] + next[2]];
    }, [0, 0, 0]);

  if (amountOfRatings === 0) return res.status(200).json({rating: [0, 0, 0], amount: 0});

  res.status(200).json({rating: rating.map((number) => number / amountOfRatings), amount: amountOfRatings});
}

/**
 * send all contracts related to oneself
 *
 * @param req
 * @param res
 */
export async function getPersonalContracts(req, res) {
  if (!isAuthenticated(req)) return error(req, res, 'Nicht Authentifiziert');

  let allContracts: IContract[];
  if (req.session.type === 'client') allContracts = await Contract.find({client: req.session._id});
  else allContracts = await Contract.find({developer: req.session._id});

  const finalArray = [];

  for (const contract of allContracts) {
    let participant: Types.ObjectId | string = req.session.type === 'client' ? contract.developer : contract.client;

    // if participant isn't existant, then this means that no developer exists for this contract
    // else the client's email is included
    if (!participant) participant = '';
    else participant = (await findUser({_id: participant})).email;

    finalArray.push({
      _id: contract._id,
      name: contract.name,
      participant,
      reward: contract.reward,
      isDone: contract.isDone,
      isPaid: contract.isPaid
    });
  }

  res.status(200).json(finalArray);
}

/**
 * create new contract and check the inputs
 *
 * @param req
 * @param res
 */
export async function createContract(req, res) {
  if (!isAuthenticated(req) || !isClient(req)) return error(req, res, 'Nutzer darf kein Auftrag erstellen');

  if (!req.body.title || req.body.title.length <= 0 || !isASCII(req.body.title)) return error(req, res, 'Titel unzulässig');
  if (isNaN(req.body.reward) || req.body.reward <= 0) return error(req, res, 'Entlohnung unzulässig');

  // check if date was parsed correctly
  if (isNaN((new Date(req.body.startDate).getMilliseconds()))) return error(req, res, 'Start Datum unzulässig');
  if (isNaN((new Date(req.body.endDate).getMilliseconds()))) return error(req, res, 'End Datum unzulässig');
  if (new Date(req.body.startDate) > new Date(req.body.endDate)) return error(req, res, 'End Datum kann nicht vor dem Start Datum liegen');

  if (!req.body.description || req.body.description.length <= 0) return error(req, res, 'Beschreibung unzulässig');
  if (!req.body.stack) return error(req, res, 'Stack unzulässig');

  const newContract = new Contract({
    client: req.session._id,
    name: req.body.title,
    reward: Number(req.body.reward),
    startingDate: new Date(req.body.startDate),
    endDate: new Date(req.body.endDate),
    details: {
      stack: req.body.stack,
      description: req.body.description,
      stage: 'Kein Auftragnehmer'
    }
  });

  const insertedContract = await newContract.save();
  res.status(200).send(insertedContract._id);
}

/**
 * get all contract attributes
 *
 * @param req
 * @param res
 */
export async function getContractInformation(req, res) {
  if (!isAuthenticated(req) || !req.body._id) return error(req, res, 'Nicht Authentifiziert');

  const foundContract = await Contract.findOne({_id: req.body._id});

  res.status(200).json({
    // insert document information
    ...foundContract['_doc'],
    clientID: process.env.paypalUser,
    developerEmail: foundContract.developer ? (await findUser({_id: foundContract.developer})).email : '',
    clientEmail: foundContract.client ? (await findUser({_id: foundContract.client})).email : '',
    developerMerchant: foundContract.developer ? (await findUser({_id: foundContract.developer}))['merchant'] : ''
  });
}

/**
 * finish off contract and set rating
 *
 * @param req
 * @param res
 */
export async function finishContract(req, res) {
  if (req.body.communication <= 0 || req.body.speed <= 0 || req.body.quality <= 0) return error(req, res, 'Rating muss mindestens ein Stern haben');
  if (!isAuthenticated(req) || !req.body._id || !isClient(req)) return error(req, res, 'Nicht Authentifiziert');

  // find contract
  const foundContract = await isInContract(req, req.body._id);
  if (!foundContract) return error(req, res, 'Interner Fehler');

  if (foundContract.developer && foundContract.isDone) return error(req, res, 'Der Auftrag ist schon abgeschlossen');

  if (!foundContract.developer) return error(req, res, 'Ohne ein Entwickler kann kein Auftrag abgeschlossen werden');

  foundContract.isDone = true;
  foundContract.rating.communication = Number(req.body.communication);
  foundContract.rating.speed = Number(req.body.speed);
  foundContract.rating.quality = Number(req.body.quality);

  // the changes are deep in the objects so it needs to be marked for mongodb
  foundContract.markModified('rating.communication');
  foundContract.markModified('rating.speed');
  foundContract.markModified('rating.quality');

  await foundContract.save();
  res.status(200).send('Abgeschlossen');
}

/**
 * select developer for a contract
 *
 * @param req
 * @param res
 */
export async function selectDeveloper(req, res) {
  if (!isAuthenticated(req) || !req.body._id || !isClient(req)) return error(req, res, 'Nicht Authentifiziert');

  const foundContract = await isInContract(req, req.body._id);
  if (!foundContract) return error(req, res, 'Interner Fehler');

  const foundUser = await findUser({email: req.body.email});
  if (!foundUser) return error(req, res, 'Interner Fehler');

  // find offer of developer
  const foundDeveloper = foundContract.potentialDevelopers.find((dev) =>
    dev.email === req.body.email && Number(dev.reward) === Number(req.body.reward)
  );
  if (!foundDeveloper) return error(req, res, 'Entwickler nicht gefunden');

  foundContract.developer = foundUser._id;
  foundContract.reward = Number(foundDeveloper.reward);
  foundContract.potentialDevelopers = [];

  await foundContract.save();
  res.status(200).send('Ausgewählt');
}

/**
 * add bid for a contract as a developer
 *
 * @param req
 * @param res
 */
export async function addDeveloperReward(req, res) {
  if (!isAuthenticated(req) || !req.body._id || !req.body.email || !req.body.reward || isClient(req)) return error(req, res, 'Nicht Authentifiziert');

  if (!req.body.reward || isNaN(req.body.reward) || Number(req.body.reward) <= 0) return error(req, res, 'Entlohnung kann nicht negativ sein');

  const foundContract = await Contract.findOne({_id: req.body._id});
  if (!foundContract) return error(req, res, 'Interner Fehler');

  // check if a developer is already working on the contract
  if (foundContract.developer) return error(req, res, 'Auftrag wurde schon von einem Entwickler angenommen');

  // check if paypal account of developer is connected
  if (!(await isPayPalVerficated(req.session.email))) return error(req, res, 'Bitte PayPal Account Verbinden');

  foundContract.potentialDevelopers.push({email: req.session.email, reward: req.body.reward});
  await foundContract.save();
  res.status(200).send('Abgeschickt');
}

/**
 * search for contracts with parameters
 *
 * @param req
 * @param res
 */
export async function searchContracts(req, res) {
  if (!isAuthenticated(req)) return error(req, res, 'Nicht Authentifiziert');

  // check if date was parsed correctly
  if (isNaN((new Date(req.body.startingDate).getMilliseconds()))) return error(req, res, 'Start Datum unzulässig');
  if (isNaN((new Date(req.body.endDate).getMilliseconds()))) return error(req, res, 'End Datum unzulässig');
  if (new Date(req.body.startingDate) > new Date(req.body.endDate)) return error(req, res, 'End Datum kann nicht vor dem Start Datum liegen');

  const finalQuery = (await Contract.find()).filter((contract) =>
    (!contract.developer === req.body.needDeveloper) &&
      (contract.reward >= req.body.minReward) && (contract.reward <= req.body.maxReward) &&
      (contract.startingDate >= new Date(req.body.startingDate)) &&
      (contract.endDate <= new Date(req.body.endDate))
  );

  const finalResponse = [];
  for (const contract of finalQuery) {
    const foundUser = await findUser({_id: contract.client});
    finalResponse.push({
      _id: contract._id,
      name: contract.name,
      client: foundUser.email,
      developer: contract.developer ? (await findUser({_id: contract.developer})).email : null,
      reward: contract.reward,
      isDone: contract.isDone,
      isPaid: contract.isPaid
    });
  }

  res.status(200).send(finalResponse);
}

/**
 * check if user is participating in a contract
 *
 * @param req
 * @param _id
 */
export async function isInContract(req, _id) {
  if (req.session.type === 'client') {
    return Contract.findOne({_id: Types.ObjectId(_id), client: Types.ObjectId(req.session._id)});
  } else {
    return Contract.findOne({_id: Types.ObjectId(_id), developer: Types.ObjectId(req.session._id)});
  }
}

/**
 * send amount of paid contracts
 *
 * @param req
 * @param res
 */
export async function amountOfPaidContracts(req, res) {
  if (!isAuthenticated(req)) return error(req, res, 'Nicht Authentifiziert');

  let type;
  if (isClient(req)) type = 'client';
  else type = 'developer';

  const foundContracts = await Contract.find({[type]: req.session._id, isPaid: true, isDone: true});

  res.status(200).json({
    paid: foundContracts.reduce((prev, curr) => prev + curr.reward, 0),
    amount: foundContracts.length
  });
}

/**
 * send amount of contracts to pay
 *
 * @param req
 * @param res
 */
export async function amountToPayContracts(req, res) {
  if (!isAuthenticated(req)) return error(req, res, 'Nicht Authentifiziert');

  let type;
  if (isClient(req)) type = 'client';
  else type = 'developer';

  const foundContracts = await Contract.find({[type]: req.session._id, isPaid: false, isDone: true});

  res.status(200).json({
    toPay: foundContracts.reduce((prev, curr) => prev + curr.reward, 0),
    amount: foundContracts.length
  });
}

/**
 * send amount of contracts that are in progress
 *
 * @param req
 * @param res
 */
export async function amountInProgressContracts(req, res) {
  if (!isAuthenticated(req)) return error(req, res, 'Nicht Authentifiziert');

  let type;
  if (isClient(req)) type = 'client';
  else type = 'developer';

  const foundContracts = await Contract.find({[type]: req.session._id, isDone: false, developer: {$exists: true}});

  res.status(200).json({
    potentialPay: foundContracts.reduce((prev, curr) => prev + curr.reward, 0),
    amount: foundContracts.length
  });
}
