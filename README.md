# Freelance Now

Project for Web-Engineering 2 @ DHBW-Mannheim

Live site: [freelance.ttnr.me](freelance.ttnr.me)

### How To Start

1. Get PayPal Developer Account
2. Set Environment Variables for PayPal
    1. paypalUser = Client ID
    2. paypalPass = Secret of Client ID
    3. BID = Sandbox BN Code
3. Set Environment Variables for Express
4. Add `nginx_network` docker network or remove it from docker-compose

#### Docker

- `docker-compose up -d --build`

#### NPM

- Start MongoDB
- Add `127.0.0.1 mongodb` to `/etc/hosts`
- `npm install && npm start`


#### General Information
- Don't use real passwords
- Only use Sandbox PayPal Accounts
