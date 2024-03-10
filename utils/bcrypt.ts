"use server"

import bcrypt from "bcrypt"
// import dotenv
const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);

export async function hashPassword(password: string | undefined): Promise<string> {

  const hashedPassword = await bcrypt.hash(password!, saltRounds);

  return hashedPassword;

}

export async function checkPasswords(password: string, hash: string): Promise<Boolean> {

  const isMatch = bcrypt.compare(password, hash);

  return isMatch;

}