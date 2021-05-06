const pathToScripts = '/scripts'

export const http_requests = (req, res, fct) => fct(pathToScripts + '/http_requests.js', res)
export const session_manager = (req, res, fct) => fct(pathToScripts + '/session_manager.js', res)
export const snackbar = (req, res, fct) => fct(pathToScripts + '/snackbar.js', res)
export const check_session = (req, res, fct) => fct(pathToScripts + '/check_session.js', res)
export const chatjs = (req, res, fct) => fct(pathToScripts + '/chat.js', res)
export const profilejs = (req, res, fct) => fct(pathToScripts + '/profile.js', res)
export const contractsjs = (req, res, fct) => fct(pathToScripts + '/contracts.js', res)
