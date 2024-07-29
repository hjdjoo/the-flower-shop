import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "@/database.types";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {

      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          }
          catch (err) {
            console.error(process.env.NODE_ENV === "development" ? `utils/supabase/server/createClient/set/err: ${err} - Ignore this message if you are update session in middleware.` : "Something went wrong")
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          }
          catch (err) {
            console.error(process.env.NODE_ENV === "development" ? `utils/supabase/server/createClient/remove/err: ${err} - Ignore this message if you are update session in middleware.` : "Something went wrong")
          }
        },
      },
    }
  )
}