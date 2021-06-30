import { GET, POST } from '/http_requests.js';
import { error } from './session_manager.js';

/**
 * get rating of user
 *
 * @param email
 * @param success
 * @param failed
 */
export function getRatings(email, success, failed) {
  POST('/api/getRatings',
    [{name: 'Content-Type', value: 'application/json'}],
    {email},
    (response) => success(response),
    (err) => {
      error(err);
      failed(err);
    }
  );
}

/**
 * get contracts related to oneself
 *
 * @param success
 * @param failed
 */
export function getPersonalContracts(success, failed) {
  GET('/api/getPersonalContracts',
    (response) => success(response),
    (err) => {
      error(err);
      failed(err);
    }
  );
}

/**
 * create new contract
 *
 * @param title
 * @param reward
 * @param startDate
 * @param endDate
 * @param description
 * @param stack
 * @param success
 * @param failed
 */
export function createContract(title, reward, startDate, endDate, description, stack, success, failed) {
  POST('/api/createContract',
    [{name: 'Content-Type', value: 'application/json'}],
    {title, reward, startDate, endDate, description, stack},
    (response) => success(response),
    (err) => {
      error(err);
      failed(err);
    }
  );
}

/**
 * get meta information of one contract
 *
 * @param _id
 * @param success
 * @param failed
 */
export function getContract(_id, success, failed) {
  POST('/api/getContractInformation',
    [{name: 'Content-Type', value: 'application/json'}],
    {_id},
    (response) => success(response),
    (err) => {
      error(err);
      failed(err);
    }
  );
}

/**
 * add comment as developer to a contract
 * 
 * @param _id 
 * @param comment 
 * @param success 
 * @param failed 
 */
export function setDoneComment(_id, comment, success, failed) {
  POST('/api/addDoneComment',
    [{name: 'Content-Type', value: 'application/json'}],
    {_id, comment},
    (response) => success(response),
    (err) => {
      error(err);
      failed(err);
    }
  );
}

/**
 * finish contract and send rating
 *
 * @param _id
 * @param communication
 * @param speed
 * @param quality
 * @param success
 * @param failed
 */
export function sendFinishContract(_id, communication, speed, quality, success, failed) {
  POST('/api/finishContract',
    [{name: 'Content-Type', value: 'application/json'}],
    {_id, communication, speed, quality},
    (response) => success(response),
    (err) => {
      error(err);
      failed(err);
    }
  );
}

/**
 * select developer for contract
 *
 * @param _id
 * @param email
 * @param reward
 * @param success
 * @param failed
 */
export function selectDeveloper(_id, email, reward, success, failed) {
  POST('/api/selectDeveloper',
    [{name: 'Content-Type', value: 'application/json'}],
    {_id, email, reward},
    (response) => success(response),
    (err) => {
      error(err);
      failed(err);
    }
  );
}

/**
 * send reward for a contract as a developer
 *
 * @param _id
 * @param email
 * @param reward
 * @param success
 * @param failed
 */
export function sendDeveloperReward(_id, email, reward, success, failed) {
  POST('/api/newDeveloperReward',
    [{name: 'Content-Type', value: 'application/json'}],
    {_id, email, reward},
    (response) => success(response),
    (err) => {
      error(err);
      failed(err);
    }
  );
}

/**
 * send search query for contracts
 *
 * @param searchObject
 * @param success
 * @param failed
 */
export function searchContract(searchObject, success, failed) {
  POST('/api/searchContracts',
    [{name: 'Content-Type', value: 'application/json'}],
    searchObject,
    (response) => success(response),
    (err) => {
      error(err);
      failed(err);
    }
  );
}

/**
 * get amount and value of paid contracts
 *
 * @param success
 * @param failed
 */
export function getPaidContracts(success, failed) {
  GET('/api/paidContracts',
    (response) => success(response),
    (err) => {
      error(err);
      failed(err);
    }
  );
}

/**
 * get amount and value of contracts to pay
 *
 * @param success
 * @param failed
 */
export function getToPayContracts(success, failed) {
  GET('/api/toPayContracts',
    (response) => success(response),
    (err) => {
      error(err);
      failed(err);
    }
  );
}

/**
 * get amount and value of contracts in progress
 *
 * @param success
 * @param failed
 */
export function getInProgressContracts(success, failed) {
  GET('/api/inProgressContracts',
    (response) => success(response),
    (err) => {
      error(err);
      failed(err);
    }
  );
}
