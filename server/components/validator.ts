const MAX_EMAIL_LENGTH = 320;
const MAX_USERNAME_LENGTH = 64;
const MAX_PASSWORD_LENGTH = 32;

/**
 * check if the primitive pattern of the input matches an email address
 * this check isn't very extensive, but it
 *
 * @param input
 */
function isEMail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

/**
 * regex check if the input is ascii conform
 *
 * @param input
 */
function isASCII(input: string): boolean {
  return (/^[\x00-\x7F]*$/.test(input));
}

/**
 * validate input for user creation
 *
 * @param body
 */
export function validInputCreateUser(body): boolean {
  if (body.username && body.password && body.email) {
    return isEMail(body.email) && body.email.length <= MAX_EMAIL_LENGTH &&
        isASCII(body.username) && body.username.length <= MAX_USERNAME_LENGTH &&
        isASCII(body.password) && body.password.length <= MAX_PASSWORD_LENGTH
  }
}

/**
 * validate input for login
 *
 * @param body
 */
export function validInputLogin(body) {
  if (body.email && body.password) {
    return isEMail(body.email) && body.email.length <= MAX_EMAIL_LENGTH &&
        isASCII(body.password) && body.password.length <= MAX_PASSWORD_LENGTH
  }
}
