import { hash, compare } from "bcrypt";

export const SALT_ROUNDS = 10;

export async function hashPassword(password, cb) {
  const hashedPassword = await hash(password, saltRounds, cb);

  return hashedPassword;
}

export async function verifyPassword(password, hashedPassword, cb) {
  const isValid = await compare(password, hashedPassword, cb);

  return isValid;
}
