const pathToComponents = '/components'

export const sidebar = (req, res, fct) => fct(pathToComponents + '/sidebar.js', res)
