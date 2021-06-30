import { getAuthorizationToken, requestPayPalDeveloperLink } from '../components/paypal_credentials';
import { findUser } from '../user_authentication/user_control';
import { error } from '../routes';
import { isAuthenticated } from '../user_authentication/session_manager';
import { Contract } from '../database/schemas/contracts_schema';

const request = require('request');

let authToken;

/**
 * send link for developer login
 *
 * @param req
 * @param res
 */
export function loginPayPal(req, res) {
  requestPayPalDeveloperLink((link) => {
    res.redirect(302, link);
  }, req.session.email, authToken);
}

/**
 * set id of developer for receiving payments
 *
 * @param req
 * @param res
 */
export async function setMerchantID(req, res) {
  if (!isAuthenticated(req) || !req.session.email || !req.query.merchantId) return error(req, res, 'Nicht Authorisiert');
  const foundUser = await findUser({email: req.session.email});
  if (!foundUser) return error(req, res, 'Nutzer nicht gefunden');

  // check if paypal account was logged in successful
  if ((req.session.email !== req.query.merchantId) ||
      (req.query.permissionsGranted !== 'true') ||
      (req.query.accountStatus !== 'BUSINESS_ACCOUNT')
  ) return error(req, res, 'Nicht Erlaubt');

  foundUser['merchant'] = req.query.merchantIdInPayPal;
  await foundUser.save();
  res.redirect(302, '/settings');
}

/**
 * check if paypal account is linked and respond with boolean
 *
 * @param req
 * @param res
 */
export async function hasConfirmedPayPal(req, res) {
  const foundUser = await findUser({email: req.body.email});
  let isConfirmed = false;

  if (!foundUser) return res.status(200).json(isConfirmed);
  if (foundUser['merchant'] && (foundUser['merchant'].length > 0)) isConfirmed = true;

  res.status(200).json(isConfirmed);
}

/**
 * return if paypal account is linked
 *
 * @param email
 */
export async function isPayPalVerficated(email): Promise<boolean> {
  const foundUser = await findUser({email});
  return foundUser['merchant'] && (foundUser['merchant'].length > 0);
}

/**
 * make first step towards paying for a contract
 * it creates an order on the paypal server
 *
 * @param req
 * @param res
 */
export async function createOrder(req, res) {
  const foundContract = await Contract.findOne({_id: req.body.contractID});
  if (!foundContract) return error(req, res, 'Auftrag nicht gefunden');

  const foundDev = await findUser({_id: foundContract.developer});
  if (!foundDev) return error(req, res, 'Entwickler nicht gefunden');

  request.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: authToken,
      'PayPal-Partner-Attribution-Id': process.env.BID
    },
    body: {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'EUR',
          value: String(foundContract.reward)
        },
        payee: {
          merchant_id: String(foundDev['merchant'])
        }
      }],
      payment_instruction: {
        disbursement_mode: 'INSTANT',
        platform_fees: []
      }
    },
    json: true
  }, (err, response, body) => {
    if (err) {
      console.error(err);
      return res.redirect(302, '/paypalError');
    }
    res.status(200).json({
      id: body.id
    });
  });
}

/**
 * finish off contract and mark it as paid if the return message of paypal is positive
 *
 * @param req
 * @param res
 */
export function captureOrder(req, res) {
  const OrderID = req.body.id;
  const contractID = req.body.contractID;
  request.post('https://api-m.sandbox.paypal.com/v2/checkout/orders/' + OrderID + '/capture', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: authToken,
      'PayPal-Partner-Attribution-Id': process.env.BID
    }
  },

  async function(err, response, body) {
    if (err) {
      console.error(err);
      return res.redirect(302, '/paypalError');
    } else {
      body = JSON.parse(body);
      const foundContract = await Contract.findOne({_id: contractID});

      try {
        if (body.purchase_units[0].payments.captures[0].status === 'COMPLETED' &&
                body.purchase_units[0].payments.captures[0].amount.currency_code === 'EUR' &&
                Number(body.purchase_units[0].payments.captures[0].amount.value) === Number(foundContract.reward)
        ) {
          console.log(`Paid Contract ${foundContract._id}`);
          foundContract.isPaid = true;
          foundContract.save();

          res.json({
            status: 'success'
          });
        }
      } catch {
        return res.redirect(302, '/paypalError');
      }
    }
  }
  );
}

/**
 * refresh paypal authentication token
 */
function refreshAuthToken() {
  getAuthorizationToken((token) => {
    authToken = token;
  });
}

// set interval to refresh authentication token
setInterval(refreshAuthToken, 1000 * 60 * 60 * 8);
refreshAuthToken();
