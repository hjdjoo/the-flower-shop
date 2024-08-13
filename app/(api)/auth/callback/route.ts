import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type CookieOptions } from "@supabase/ssr";
import { createClient } from "@/utils/supabase/server";
import { createProfile } from "@/utils/supabase/serverActions/createProfile";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  try {
    if (code) {
      const supabase = createClient();

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {

        if (!data.user.user_metadata.shop_acct_id) {

          const body = {
            userId: data.user.id
          }

          const res = await fetch("http://localhost:3000/auth/create-shop-profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          })

          if (!res.ok || !res.body) {
            throw new Error(`Couldn't create shop profile! ${res.body}`)
          }
        }

        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }
  catch (e) {
    console.error("auth/callback/catch/e", e);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  }

}