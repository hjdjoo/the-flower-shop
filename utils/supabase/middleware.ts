import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // setting up response to eventually return. "next" returns modified request headers. Here, we are setting up the request headers and initializing it to what originally came in.
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  })
  console.log('/utils/supabase/updateSession/response: ', response)

  // with each call, we create a new supabase client. Supabase tells us not to worry bc this is very lightweight -- basically just setting up a fetch call.
  // here, a closure is being created around the instance of the server client, allowing "response" to be read elsewhere.
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

  await supabase.auth.getUser();

  return response;
}


