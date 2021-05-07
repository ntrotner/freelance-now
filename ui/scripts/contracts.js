import {GET, POST} from '/http_requests.js'
import {error} from './session_manager.js'

export function getContracts(email, success, failed) {
    POST('/api/getContractsMeta',
        [{name: 'Content-Type', value: 'application/json'}],
        {email},
        (response) => success(response),
        (err) => {
            error(err)
            failed(err)
        }
    )
}

export function getPersonalContracts(success, failed) {
    GET('/api/getPersonalContracts',
        (response) => success(response),
        (err) => {
            error(err)
            failed(err)
        }
    )
}

export function createContract(title, reward, startDate, endDate, description, stack, success, failed) {
    POST('/api/createContract',
        [{name: 'Content-Type', value: 'application/json'}],
        {title, reward, startDate, endDate, description, stack},
        (response) => success(response),
        (err) => {
            error(err)
            failed(err)
        }
    )
}

export function getContract(_id, success, failed) {
    POST('/api/getContractInformation',
        [{name: 'Content-Type', value: 'application/json'}],
        {_id},
        (response) => success(response),
        (err) => {
            error(err)
            failed(err)
        }
    )
}

export function sendFinishContract(_id, communication, speed, quality, success, failed) {
    POST('/api/finishContract',
        [{name: 'Content-Type', value: 'application/json'}],
        {_id, communication, speed, quality},
        (response) => success(response),
        (err) => {
            error(err)
            failed(err)
        }
    )
}

export function selectDeveloper(_id, email, reward, success, failed) {
    POST('/api/selectDeveloper',
        [{name: 'Content-Type', value: 'application/json'}],
        {_id, email, reward},
        (response) => success(response),
        (err) => {
            error(err)
            failed(err)
        }
    )
}

export function sendDeveloperReward(_id, email, reward, success, failed) {
    POST('/api/newDeveloperReward',
        [{name: 'Content-Type', value: 'application/json'}],
        {_id, email, reward},
        (response) => success(response),
        (err) => {
            error(err)
            failed(err)
        }
    )
}

export function searchContract(searchObject, success, failed) {
    POST('/api/searchContracts',
        [{name: 'Content-Type', value: 'application/json'}],
        searchObject,
        (response) => success(response),
        (err) => {
            error(err)
            failed(err)
        }
    )
}

export function getPaidContracts(success, failed) {
    GET('/api/paidContracts',
        (response) => success(response),
        (err) => {
            error(err)
            failed(err)
        }
    )
}

export function getToPayContracts(success, failed) {
    GET('/api/toPayContracts',
        (response) => success(response),
        (err) => {
            error(err)
            failed(err)
        }
    )
}

export function getInProgressContracts(success, failed) {
    GET('/api/inProgressContracts',
        (response) => success(response),
        (err) => {
            error(err)
            failed(err)
        }
    )
}
