import {GET, POST} from "/http_requests.js";

export function getContracts(email, success, failed) {
    POST('/api/getContractsMeta',
        [{name: "Content-Type", value: "application/json"}],
        {email},
        (response) => success(response),
        (msg) => failed(msg)
    );
}

export function getPersonalContracts(success, failed) {
    GET('/api/getPersonalContracts',
        (response) => success(response),
        (err) => failed(err)
    )
}

export function createContract(title, reward, startDate, endDate, description, stack, success, failed) {
    POST('/api/createContract',
        [{name: "Content-Type", value: "application/json"}],
        {title, reward, startDate, endDate, description, stack},
        (response) => success(response),
        (error) => failed(error)
    )
}

export function getContract(_id, success, failed) {
    POST('/api/getContractInformation',
        [{name: "Content-Type", value: "application/json"}],
        {_id},
        (response) => success(response),
        (error) => failed(error)
    )
}

export function sendFinishContract(_id, communication, speed, quality, success, failed) {
    POST('/api/finishContract',
        [{name: "Content-Type", value: "application/json"}],
        {_id, communication, speed, quality},
        (response) => success(response),
        (error) => failed(error)
    )
}

export function selectDeveloper(_id, email, reward, success, failed) {
    POST('/api/selectDeveloper',
        [{name: "Content-Type", value: "application/json"}],
        {_id, email, reward},
        (response) => success(response),
        (error) => failed(error)
    )
}

export function sendDeveloperReward(_id, email, reward, success, failed) {
    POST('/api/newDeveloperReward',
        [{name: "Content-Type", value: "application/json"}],
        {_id, email, reward},
        (response) => success(response),
        (error) => failed(error)
    )
}
