import { createUser } from "@/lib/mongoDb/mongo";
import { NextRequest, NextResponse } from "next/server";

console.log('Entering api/createUser')

export async function POST(req: NextRequest) {

  try {

    const { credentials } = await req.json();

    const userInfo = await createUser(credentials);

    console.log('api/createUser/POST/userId: ', userInfo);

    const res = new NextResponse();

    res.cookies.set('userId', userInfo?.userId);
    res.cookies.set('isAdmin', userInfo?.isAdmin);

    return res;

  }
  catch (err) {
    console.error('createUser/POST/err: ', err)

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }

}