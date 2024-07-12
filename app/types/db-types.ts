import { PostgrestError } from "@supabase/supabase-js"

export interface SupabaseResponse<T> {
  data: T | null
  error: PostgrestError | unknown | null
}

export interface CategoryData {
  id: number,
  name: string,
  is_active: boolean,
}


export interface ProductData {
  id: string,
  name: string,
  categories: number[] | null
  description: string,
  standard_price: string
  premium_price: string
  deluxe_price: string
  image_url: string,
}