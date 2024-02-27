import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

console.log('Entering middleware.ts')

export const middleware = async (res: NextResponse) => {
  // return new NextResponse;
}


export const config = {
  matcher: [
    '/auth'
  ]
}