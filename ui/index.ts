import { app } from '../server'
import { getRoute } from './routes'

export function startUI (): void {
  app.get('*', (req, res) => {
    if (req.url.includes('.js')) {
      res.type('.js')
    }
    getRoute(req.originalUrl, req, res)
  })
}
