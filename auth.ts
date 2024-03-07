import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getGoogleVariables } from "./utils/getAuthVariables";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [Google({
    clientId: getGoogleVariables().clientId,
    clientSecret: getGoogleVariables().clientSecret
  })]
})