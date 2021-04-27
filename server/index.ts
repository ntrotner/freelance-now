import { getRoute, postRoute } from './routes';

const express = require('express');
const bodyParser = require('body-parser');

export const app = express();
export * from './database';

app.use(bodyParser.json());

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
