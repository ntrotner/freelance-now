import { getRoute } from './routes';

const express = require('express');
export const app = express();


export function startServer(): void {
  app.get('/api/*', (req, res) => getRoute(req.originalUrl, req, res));

  app.listen(process.env.EXPRESSPORT, () =>
      console.log(`Server started at http://localhost:${process.env.EXPRESSPORT}`)
  );
}
