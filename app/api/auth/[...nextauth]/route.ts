import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { Redirect } from "next";

import Credentials from "next-auth/providers/credentials";
import { redirect } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

import { getGoogleVariables } from "@/utils/getAuthVariables";
import { verifyCredentials } from "@/lib/mongoDb/mongo";
import { hashPassword } from "@/utils/bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials): Promise<any> => {
        try {

          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = credentials.email
          const password = await hashPassword(credentials.password);

          const user = await verifyCredentials({ email, password })
          console.log('[nextauth]/route/NextAuth.authorise: ', user)

          console.log('[nextauth]/authorize/user: ', user)
          if (!user) throw new Error("Invalid credentials.")

          return user;
        }
        catch (err) {
          console.error('[...nextauth]/err: ', err);

          NextResponse.redirect(`${process.env.NEXTAUTH_URL}/account/signin`)

        }
      }
    }),
    Google({
      clientId: getGoogleVariables().clientId,
      clientSecret: getGoogleVariables().clientSecret
    })
  ]
})

export { handler as GET, handler as POST }