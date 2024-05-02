// import mongoose from "mongoose";
// import User from "./models";
// import { Credentials } from "../types/authTypes";
// import { hashPassword, checkPasswords } from "@/utils/bcrypt";

// const { MONGO_USERNAME, MONGO_PASSWORD } = process.env;

// mongoose.connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@TheFlowerShop.5s5bhqg.mongodb.net/?retryWrites=true&w=majority&appName=The-Flower-Shop`)


// // Had to take out try/catch block to allow error thrown to reach nextauth handler.
// export async function createUser(data: Credentials) {

//   const { email, password } = data;
//   // find user. if user exists, throw error with message "User already exists". Otherwise, insert new user.

//   console.log(User)


//   const userExists = await User.findOne({ "email": email }, "id, email, password");

//   console.log('mongo.ts/createUser/userExists: ', userExists)

//   if (userExists) {
//     console.log('email already in use')
//     throw new Error("Email is already in use");
//   }

//   console.log('about to create user')
//   const hashedPassword = await hashPassword(password)

//   // create new user if possible. User document should be returned.
//   // only send back the ID and the user email.
//   const user = await User.create({ email: email, password: hashedPassword, isAdmin: false });

//   if (!user) {
//     throw new Error("Couldn't save user!")
//   }
//   else {
//     const userInfo = {
//       userId: user._id,
//       isAdmin: user.isAdmin
//     };

//     return userInfo

//   };

// }

// export async function verifyCredentials(data: Credentials) {
//   const { email, password } = data;

//   console.log(process.env.NODE_ENV)

//   const user = await User.findOne({ "email": email }, "_id email password isAdmin");

//   console.log('mongo/verifyCredentials/user: ', user)

//   if (!user) {
//     console.log("Error in mongo.ts/verifyCredentials/user||user.password")
//     console.log(process.env.NODE_ENV === "development" ? user : "Error while finding user")
//     throw new Error("Invalid credentials.");
//   }

//   const userIsValid = await checkPasswords(password, user.password);

//   console.error("Error in mongo.ts/verifyCredentials/await checkPasswords")

//   console.error(process.env.NODE_ENV === "development" ? userIsValid : "Something went wrong")

//   if (!userIsValid) throw new Error("Invalid credentials.");

//   return { userId: user._id, email: user.email, isAdmin: user.isAdmin };

// }