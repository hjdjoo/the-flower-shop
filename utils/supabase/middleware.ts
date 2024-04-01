"use server"

import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";

import formJson from "../actions/parseCookie";
import checkAdmin from "./checkAdmin";

// import * as jose from "jose"

export async function updateSession(request: NextRequest) {
  // setting up response to eventually return. "next" returns modified request headers. Here, we are setting up the request headers and initializing it to what originally came in.
  // console.log('updateSession - request.cookies: ', request.cookies)
  const cookieStore = cookies();

  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  })

  // with each call, we create a new supabase client. Supabase tells us not to worry bc this is very lightweight -- basically just setting up a fetch call.

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {

          request.cookies.set({
            name, value, ...options,
          });

          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          response.cookies.set({
            name, value, ...options,
          });
        },
        remove(name: string, options: CookieOptions) {

          request.cookies.set({
            name, value: "", ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            }
          });
          response.cookies.set({
            name, value: "", ...options
          });
        },
      },
    }
  )

  const requestCookies = cookieStore.getAll();
  // console.log(requestCookies)

  // formJson() is a utility function for combining sb-auth-token cookies into a single readble json file.
  const jwtJson = formJson(requestCookies);

  if (jwtJson.length) {
    // getUser() was not working without passing the jwt before... issue seems to have reversed while I was fixing things elsewhere.
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.log('Error while checking supabase.auth.getUser()')
      console.error(error);
    }
    if (!data.user) {
      console.log("No user found!")
      response.cookies.set("userRole", "guest")
      return response;
    }

    // console.log('@/utils/supabase/middleware/updateSession/data.user?.id', data.user.id)

    const isAdmin = await checkAdmin(data.user.id);

    if (isAdmin) {
      console.log("setting user role...");
      response.cookies.set("userRole", "admin")
    }
    else {
      console.log("setting user role...");
      response.cookies.set("userRole", "user")
    }

  }

  // console.log("@/utils/supabase/middleware.ts", response)

  return response;
}
