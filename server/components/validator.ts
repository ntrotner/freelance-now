const MAX_EMAIL_LENGTH = 320;
const MAX_USERNAME_LENGTH = 64;
const MAX_PASSWORD_LENGTH = 32;

const MIN_EMAIL_LENGTH = 5;
const MIN_USERNAME_LENGTH = 2;
const MIN_PASSWORD_LENGTH = 8;

/**
 * check if the primitive pattern of the input matches an email address
 * this check isn't very extensive, but it
 *
 * @param input
 */
export function isEMail(input: string): boolean {
  try {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) && isASCII(input) && MIN_EMAIL_LENGTH <= input.length && input.length <= MAX_EMAIL_LENGTH;
  } catch {
    return false;
  }
}

/**
 * regex check if the input is ascii conform
 *
 * @param input
 */
export function isASCII(input: string): boolean {
  try {
    return (/^[\x00-\x7F]*$/.test(input));
  } catch {
    return false;
  }
}

export function isValidName(input: string): boolean {
  try {
    return isASCII(input) && MIN_USERNAME_LENGTH <= input.length && input.length <= MAX_USERNAME_LENGTH;
  } catch {
    return false
  }
}

export function isValidPassword(password): boolean {
  try {
    return isASCII(password) && MIN_PASSWORD_LENGTH <= password.length && password.length <= MAX_PASSWORD_LENGTH;
  } catch {
    return false
  }
}

/**
 * validate input for user creation
 *
 * @param body
 */
export function validInputCreateUser(body): boolean {
  if (body.username && body.password && body.email) {
    return isEMail(body.email) && isValidName(body.username) && isValidPassword(body.password)
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
