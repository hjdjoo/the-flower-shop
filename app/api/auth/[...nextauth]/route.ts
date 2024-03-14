import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Auth0Provider from "next-auth/providers/auth0"
import Credentials from "next-auth/providers/credentials";

import { redirect } from "next/dist/server/api-utils";
import { Redirect } from "next";
import { NextRequest, NextResponse } from "next/server";

import { getAuth0Variables, getGoogleVariables } from "@/utils/getAuthVariables";
import { verifyCredentials } from "@/lib/mongoDb/mongo";
import { hashPassword } from "@/utils/bcrypt";
import { get } from "http";

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
    }),
    Auth0Provider({
      clientId: getAuth0Variables().clientId,
      clientSecret: getAuth0Variables().clientSecret,
      issuer: getAuth0Variables().issuer
    })
  ],
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/account/signin'
  },
})

export { handler as GET, handler as POST }