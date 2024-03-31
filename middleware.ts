import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware"

// export { auth as default } from "@/auth"

console.log('Entering middleware.ts')

export const middleware = async (request: NextRequest) => {

  // console.log('middleware/request? ', !!request)
  // console.log('middleware/request.cookies: ', request.cookies)
  if (request.cookies.has("next-auth.session-token")) {
    request.cookies.delete("next-auth.session-token")
  }

  // we need to check if a user has a profile.
  // 

  console.log('updating session...')
  // Try grabbing the auth token from the cookies and passing it into getUser() -- see if that helps?
  await updateSession(request);

  // if (request.nextUrl.pathname.startsWith('/admin')) {

  // }

  console.log('returning out of middleware');
  return NextResponse.next();

}


export const config = {
  matcher: [
    "/",
    "/account/(.*)",
    "/admin/(.*)"
  ]
}