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
  id: string
  name: string
  categories: number[] | null
  description: string
  prices: number[]
  image_url: string
}