import { app } from '../server';
import { getRoute } from './routes';

export function startUI(): void {
  app.get('*', (req, res) => {
    res.sendFile(getRoute(req.originalUrl));
  });
}
