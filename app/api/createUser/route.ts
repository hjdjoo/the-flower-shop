import { createUser } from "@/lib/mongoDb/mongo";
import { NextRequest, NextResponse } from "next/server";

console.log('Entering api/createUser')

export async function POST(req: NextRequest) {

  try {

    const { credentials } = await req.json();

    const userId = await createUser(credentials);

    console.log('api/createUser/POST/userId: ', userId);

    return NextResponse.json({ userId: userId }, { status: 201 })

  }
  catch (err) {
    console.error('createUser/POST/err: ', err)

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }

}