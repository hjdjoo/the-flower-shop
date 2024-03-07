import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { getGoogleVariables } from "./utils/getAuthVariables";

import { verifyCredentials } from "./lib/mongoDb/mongo";
import { Credentials, User } from "./lib/types/authTypes";

export const {
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials): Promise<User | null> => {

        const email = credentials?.email
        const password = credentials?.password

        if (!email || !password) {
          return null;
        }

        const user = await verifyCredentials({ email, password })

        if (!user) throw new Error("Invalid credentials.")

        return user;

      }
    }),
    Google({
      clientId: getGoogleVariables().clientId,
      clientSecret: getGoogleVariables().clientSecret
    })
  ]
})