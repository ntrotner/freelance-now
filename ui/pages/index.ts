const pathToPages = '/pages';

export const home = (req, res, fct) => fct(pathToPages + '/home/home.html', res);
export const login = (req, res, fct) => fct(pathToPages + '/login/login.html', res);
export const register = (req, res, fct) => fct(pathToPages + '/register/register.html', res);
export const logout = (req, res, fct) => fct(pathToPages + '/logout/logout.html', res);
export const welcome = (req, res, fct) => fct(pathToPages + '/welcome/welcome.html', res);
export const settings = (req, res, fct) => fct(pathToPages + '/settings/settings.html', res);
export const chat = (req, res, fct) => fct(pathToPages + '/chat/chat.html', res);
export const profile = (req, res, fct) => fct(pathToPages + '/profile/profile.html', res);
export const newContract = (req, res, fct) => fct(pathToPages + '/newContract/newContract.html', res);
export const contracts = (req, res, fct) => fct(pathToPages + '/contracts/contracts.html', res);
export const contract = (req, res, fct) => fct(pathToPages + '/contract/contract.html', res);
export const search = (req, res, fct) => fct(pathToPages + '/search/search.html', res);

export const homecss = (req, res, fct) => fct(pathToPages + '/home/home.css', res);
export const registercss = (req, res, fct) => fct(pathToPages + '/register/register.css', res);
export const logincss = (req, res, fct) => fct(pathToPages + '/login/login.css', res);
export const settingscss = (req, res, fct) => fct(pathToPages + '/settings/settings.css', res);
export const defaultcss = (req, res, fct) => fct('/general/default.css', res);
export const welcomecss = (req, res, fct) => fct(pathToPages + '/welcome/welcome.css', res);
export const chatcss = (req, res, fct) => fct(pathToPages + '/chat/chat.css', res);
export const profilecss = (req, res, fct) => fct(pathToPages + '/profile/profile.css', res);
export const snackbarcss = (req, res, fct) => fct('/general/snackbar.css', res);
export const newContractcss = (req, res, fct) => fct(pathToPages + '/newContract/newContract.css', res);
export const contractcss = (req, res, fct) => fct(pathToPages + '/contract/contract.css', res);
export const contractscss = (req, res, fct) => fct(pathToPages + '/contracts/contracts.css', res);
export const searchcss = (req, res, fct) => fct(pathToPages + '/search/search.css', res);
