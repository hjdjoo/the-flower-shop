import { NextResponse, NextRequest } from "next/server";
import { createProfile } from "@/utils/supabase/serverActions/createProfile";

export async function POST(request: NextRequest) {

  const body = await request.json();

  const userId = body.userId;

  const { error } = await createProfile(userId);

  if (!error) {
    return NextResponse.json({ message: "Account successfully created!" }, { status: 200 })

  }

  return NextResponse.json({ error: error }, { status: 500 })
}