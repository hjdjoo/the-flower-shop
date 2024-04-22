import { NextResponse, type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { updateSession, authorizeAdmin } from "@/utils/supabase/middleware"
import checkAdmin from "./utils/supabase/serverActions/checkAdmin";

console.log('Entering middleware.ts')

export const middleware = async (request: NextRequest) => {

  // console.log('middleware/request.cookies: ', request.cookies)
  if (request.cookies.has("next-auth.session-token")) {
    request.cookies.delete("next-auth.session-token")
  }

  console.log('updating session...')
  const response = await updateSession(request);

  // checking admin access:
  if (request.url.startsWith("/admin")) {

    console.log('checking Admin privileges...')

    const authorized = await authorizeAdmin();
    if (!authorized) return NextResponse.redirect("/")

  }

  console.log('returning out of middleware');
  return response;
}


export const config = {
  matcher: [
    "/",
    "/account/:path",
    "/admin/:path"
  ]
}