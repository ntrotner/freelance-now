function healthCheck(req, res) {
  res.sendStatus(200);
}

function error(req, res) {
  res.sendStatus(404);
}

const routes = {
  '/api/health': healthCheck
}

export function getRoute(route: string, req, res): void {
  (routes[route] ? routes[route] : error)(req, res);
}
