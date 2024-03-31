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

  const jwtJson = formJson(requestCookies);
  // console.log(jwtJson);

  if (jwtJson.length) {
    const authJwt = JSON.parse(jwtJson);
    // console.log(authJwt);

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.log('Error while checking supabase.auth.getUser()')
      console.error(error);
    }

    console.log('@/utils/supabase/middleware/updateSession/data.user?.id', data.user?.id)

    // await checkAdmin(data.user?.id)

  }

  return response;
}

// export async function checkAdmin(uuid: string | undefined) {

//   if (!uuid) return;

//   const supabase = createClient();

//   console.log(uuid);

//   const { data, error } = await supabase
//     .from("profiles")
//     .select("is_admin")
//     .eq('user_id', uuid)
//     .limit(1)
//     .single();

//   console.log('checkAdmin/data: ', data?.is_admin)
//   console.log('checkAdmin/typeof data: ', typeof data?.is_admin)
//   return data?.is_admin

// }

