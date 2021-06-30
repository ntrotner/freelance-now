const pathToResources = '/resources';

export const paypalError = (req, res, fct) => fct(pathToResources + '/contract/contract.html', res);
