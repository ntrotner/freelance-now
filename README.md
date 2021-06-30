# Freelance Now

Project for Web-Engineering 2 @ DHBW-Mannheim

Live site: [freelance.ttnr.me](https://freelance.ttnr.me)

### How To Start

1. Get PayPal Developer Account
2. Set Environment Variables for PayPal
    1. paypalUser = Client ID
    2. paypalPass = Secret of Client ID
    3. BID = Sandbox BN Code
3. Set Environment Variables for Express

#### Docker
1. Add `nginx_network` docker network or remove it from docker-compose (`docker network create nginx_network`)
2. `docker-compose up -d --build`

#### NPM

1. Start MongoDB
2. Add `127.0.0.1 mongodb` to `/etc/hosts`
3. `npm install && npm start`


#### General Information
- Don't use real passwords
- Only use Sandbox PayPal Accounts

#### PayPal
When using a local version to run the app (without a host domain) then
on verification with a business PayPal Account the URL on the "Go back to Test Store"
needs to be copied and adjusted to `http://localhost:port/api/successPayPal?...`.
Also adjust the protocol to http.
