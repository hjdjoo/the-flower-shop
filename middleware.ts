import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware"

// export { auth as default } from "@/auth"

console.log('Entering middleware.ts')

const protectedRoutes = ["/account", "/admin/*"]

export const middleware = async (request: NextRequest) => {

  console.log('middleware/request: ', request)

  await updateSession(request);

}


export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico)/*)"
  ]
}