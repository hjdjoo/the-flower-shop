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


export interface ProductData {
  id: string,
  name: string,
  description: string,
  standard_price: number | string | undefined,
  premium_price: number | string | undefined,
  deluxe_price: number | string | undefined,
  image_url: string,
}