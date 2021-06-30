const pathToResources = '/resources';

export const paypalError = (req, res, fct) => fct(pathToResources + '/paypal.png', res);
