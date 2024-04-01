import { NextResponse, type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { updateSession } from "@/utils/supabase/middleware"

console.log('Entering middleware.ts')

export const middleware = async (request: NextRequest) => {

  // console.log('middleware/request.cookies: ', request.cookies)
  if (request.cookies.has("next-auth.session-token")) {
    request.cookies.delete("next-auth.session-token")
  }

  console.log('updating session...')
  const response = await updateSession(request);

  console.log('returning out of middleware');
  return response;

}


export const config = {
  matcher: [
    "/",
    "/account/(.*)",
    "/admin/(.*)"
  ]
}