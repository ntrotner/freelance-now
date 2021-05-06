import { getAuthorizationToken, requestPayPalDeveloperLink } from '../components/paypal/initRequests';
import { findUser } from '../user_authentication/user_control';
import { error } from '../routes';
import { isAuthenticated } from '../user_authentication/session_manager';
import { Contract } from '../database/schemas/contracts_schema';

var request = require('request');

let authToken;

export function loginPayPal(req, res) {
  requestPayPalDeveloperLink((link) => {
    res.redirect(302, link)
  }, req.session.email, authToken)
}

export async function setMerchantID(req, res) {
  if (!isAuthenticated(req) || !req.session.email || !req.query.merchantId) return error(req, res, 'Nicht Authorisiert');
  const foundUser = await findUser({email: req.session.email})
  if (!foundUser) return error(req, res, 'Nutzer nicht gefunden');

  if (
      (req.session.email !== req.query.merchantId) ||
      (req.query.permissionsGranted !== 'true') ||
      (req.query.accountStatus !== 'BUSINESS_ACCOUNT')
  ) return error(req, res, 'Nicht Erlaubt');

  foundUser['merchant'] = req.query.merchantIdInPayPal;
  foundUser.save()
  res.redirect(302, '/settings');

  /**
   * merchantId=abc
   * merchantIdInPayPal=JTARYZ92XQAR4
   * permissionsGranted=true&consentStatus=true
   * productIntentId=addipmt
   * productIntentID=addipmt
   * isEmailConfirmed=false
   * accountStatus=BUSINESS_ACCOUNT
   */
}

export async function hasConfirmedPayPal(req, res) {
  const foundUser = await findUser({email: req.body.email});
  res.status(200).json(foundUser['merchant'] && (foundUser['merchant'].length > 0))
}

export async function isPayPalVerficated(email) {
  const foundUser = await findUser({email});
  return foundUser['merchant'] && (foundUser['merchant'].length > 0)
}

export async function createOrder(req, res) {

  const foundContract = await Contract.findOne({_id: req.body.contractID});
  if (!foundContract) return error(req, res, 'Auftrag nicht gefunden');

  const foundDev = findUser({_id: foundContract.developer})
  if (!foundDev) return error(req, res, 'Entwickler nicht gefunden');

  request.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authToken,
      'PayPal-Partner-Attribution-Id': process.env.EXPRESSPORT
    },
    body: {
      'intent': 'CAPTURE',
      'purchase_units': [{
        'amount': {
          'currency_code': 'EUR',
          'value': String(foundContract.reward)
        }
      }],
      'payee': {
        'merchant_id': String(foundDev['merchant'])
      },
      'payment_instruction': {
        'disbursement_mode': 'INSTANT',
        'platform_fees': []
      }
    },
    json: true
  }, function (err, response, body) {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.status(200).json({
      id: body.id
    });
  });
}

export function captureOrder(req, res) {
  var OrderID = req.body.id;
  var contractID = req.body.contractID
  request.post('https://api-m.sandbox.paypal.com/v2/checkout/orders/' + OrderID + '/capture', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
          'PayPal-Partner-Attribution-Id': process.env.EXPRESSPORT
        }
      },

      async function (err, response, body) {
        if (err) {
          console.error(err);
          return res.sendStatus(500);
        } else {
          body = JSON.parse(body);
          const foundContract = await Contract.findOne({_id: contractID});

          if (body.purchase_units[0].payments.captures[0].status === 'COMPLETED' &&
              body.purchase_units[0].payments.captures[0].amount.currency_code === 'EUR' &&
              Number(body.purchase_units[0].payments.captures[0].amount.value) === Number(foundContract.reward)
          ) {
            console.log('Paid Contract')
            foundContract.isPaid = true;
            foundContract.save();

            res.json({
              status: 'success'
            });
          }
        }
      }
  );
}

function refreshAuthToken() {
  getAuthorizationToken((token) => {
    authToken = token;
  });
}

setInterval(refreshAuthToken, 1000 * 60 * 60 * 8)
refreshAuthToken()
