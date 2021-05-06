const bcrypt = require('bcrypt')

/**
 * takes an password and hashes it so it can be saved
 *
 * @param password
 */
export async function hashPassword (password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

/**
 * compares hash with password and returns true if it's the same
 *
 * @param hash
 * @param password
 */
export async function verifyPassword (hash: any, password: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}
