import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// export { auth as default } from "@/auth"

console.log('Entering middleware.ts')

const protectedRoutes = ["/checkout", "/account", "/admin/*"]

export const middleware = async (req: NextRequest, res: NextResponse) => {
  // return new NextResponse;
  // check 


}


export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ]
}