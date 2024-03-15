import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware"

// export { auth as default } from "@/auth"

console.log('Entering middleware.ts')

export const middleware = async (request: NextRequest) => {

  console.log('middleware/request? ', !!request)

  await updateSession(request);

  return NextResponse.next();

}


export const config = {
  matcher: [
    "/account/(.*)",
    "/admin/(.*)"
  ]
}