import { createBrowserClient } from '@supabase/ssr'
// import { SupabaseClientOptions } from "@supabase/supabase-js";
import { Database } from '@/database.types'

export function createClient() {

  // console.log("supabase/client/apiKey", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}