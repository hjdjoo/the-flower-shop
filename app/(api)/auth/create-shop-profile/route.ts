import { NextResponse, NextRequest } from "next/server";
import { createProfile } from "@/utils/supabase/serverActions/createProfile";
import { updateUser } from "@/utils/supabase/serverActions/updateUser";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {

  const body = await request.json();

  const userId = body.userId;

  const { error } = await createProfile(userId);

  if (!error) {

    const { error: updateError } = await updateUser(userId)

    if (!updateError) {
      return NextResponse.json({ message: "Account successfully created!" }, { status: 200 })
    }
    return NextResponse.json({ error: updateError }, { status: 500 })
  }

  return NextResponse.json({ error: error }, { status: 500 })
}