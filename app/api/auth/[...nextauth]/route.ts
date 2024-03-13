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

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email
        const password = credentials.password

        const user = await verifyCredentials({ email, password })
        console.log('[nextauth]/route/NextAuth.authorise: ', user)

        console.log('[nextauth]/authorize/user: ', user)
        if (!user) return false;

        const { userId, isAdmin } = user

        return true;

      }
    }),
    Google({
      clientId: getGoogleVariables().clientId,
      clientSecret: getGoogleVariables().clientSecret
    })
  ],
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/account/signin'
  },
})

export { handler as GET, handler as POST }