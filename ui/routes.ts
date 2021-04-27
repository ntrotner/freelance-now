import path = require('path');

const routes = {
  '/': '/home/home.html',
  '/home.css': '/home/home.css',
  '/default.css': '/default.css'
}

export function getRoute(route: string): string {
  return path.join(__dirname + (routes[route] ? routes[route] : '/error/error.html'));
}
