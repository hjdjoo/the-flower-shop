import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

console.log('Entering middleware.ts')

export const middleware = async (res: NextResponse) => {


}


export const config = {
  matcher: [
    '/'
  ]
}