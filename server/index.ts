import { getRoute, postRoute } from './routes';

const MongoStore = require('connect-mongo');
const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser');

export const app = express();
export * from './database';

app.use(bodyParser.json());

app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  store: MongoStore.create({mongoUrl: 'mongodb://localhost:27017/expressSession'}),
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 6 // max six hours
  }
}));

/**
 * starts api's
 */
export function startServer(): void {
  app.get('/api/*', (req, res) => getRoute(req.originalUrl, req, res));

  app.post('/api/*', (req, res) => postRoute(req.originalUrl, req, res));

  app.listen(process.env.EXPRESSPORT, () =>
      console.log(`Server started at http://localhost:${process.env.EXPRESSPORT}`)
  );
}
