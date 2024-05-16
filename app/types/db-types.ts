import { PostgrestError } from "@supabase/supabase-js"

export interface SupabaseResponse<T> {
  data: T | null
  error: PostgrestError | Error | unknown | null
}

export interface CategoryData {
  id: number,
  name: string,
  is_active: boolean,
}