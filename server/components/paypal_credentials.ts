var request = require('request');

/**
 * get authentication token for paypal requests
 *
 * @param callback
 */
export function getAuthorizationToken(callback) {
  const headersAuthorize = {
    'Accept': 'application/json',
    'Accept-Language': 'en_US'
  };

  var dataStringAuthorize = 'grant_type=client_credentials';

  var optionsAuthorize = {
    url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
    method: 'POST',
    headers: headersAuthorize,
    body: dataStringAuthorize,
    auth: {
      'user': process.env.paypalUser,
      'pass': process.env.paypalPass
    }
  };

  function callbackAuthorize(error, response, body) {
    if (!error && response.statusCode == 200) {
      const parsed = JSON.parse(body);
      const authorization = parsed.token_type + ' ' + parsed.access_token;
      callback(authorization);
    }
  }

  request(optionsAuthorize, callbackAuthorize);
}


/**
 * get link for log in
 *
 * @param callbackSuccess
 * @param email
 * @param authToken
 */
export function requestPayPalDeveloperLink(callbackSuccess, email, authToken) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': authToken
  };

  const dataString = `{"partner_config_override": {"return_url": "https://freelance.ttnr.me/api/successPayPal"}, "tracking_id": "${email}", "operations": [ { "operation": "API_INTEGRATION", "api_integration_preference": { "rest_api_integration": { "integration_method": "PAYPAL", "integration_type": "THIRD_PARTY", "third_party_details": { "features": [ "PAYMENT", "REFUND" ] } } } } ], "products": [ "EXPRESS_CHECKOUT" ], "legal_consents": [ { "type": "SHARE_DATA_CONSENT", "granted": true } ] }`;

  const options = {
    url: 'https://api-m.sandbox.paypal.com/v2/customer/partner-referrals',
    method: 'POST',
    headers: headers,
    body: dataString
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 201) {
      const parsed = JSON.parse(body);
      callbackSuccess(parsed.links.find((link) => link.rel === 'action_url').href);
    } else {
    }
  }

  request(options, callback);
}

