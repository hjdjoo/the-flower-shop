import mongoose from "mongoose";
import { User } from "./models";
// import bcrypt from "bcrypt"
import { Credentials } from "../types/authTypes";
import { hashPassword, checkPasswords } from "@/utils/bcrypt";

const { MONGO_USERNAME, MONGO_PASSWORD } = process.env;

mongoose.connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@the-flower-shop.5s5bhqg.mongodb.net/?retryWrites=true&w=majority&appName=The-Flower-Shop`)

// const saltRounds = 10;

export async function createUser(data: Credentials) {
  try {
    const { email, password } = data;
    // find user. if user exists, throw error with message "User already exists". Otherwise, insert new user.
    const userExists = await User.findOne({ "email": email }, "id");

    if (userExists) {
      throw new Error("Email is already in use");
    }
    else {
      const hashedPassword = await hashPassword(password);
      await User.create({ email: email, password: hashedPassword });
    }

  }
  catch (err) {
    console.error(err)
  };
}

export async function verifyCredentials(data: Credentials) {
  try {
    const { email, password } = data;

    const user = await User.findOne({ "email": email }, "_id email password isAdmin");

    if (!user || !user.password) {
      throw new Error("Invalid credentials.");
    }

    const hashedPassword = user?.password;

    const userIsValid = await checkPasswords(password, hashedPassword);

    if (!userIsValid) throw new Error("Invalid credentials.");

    return { id: user._id, email: user.email, isAdmin: user.isAdmin };

  }
  catch (err) {
    console.error(err)

  }
}