import { createClient } from "../client";
import { SupabaseResponse } from "@/app/types/db-types";

export const getBanners = async () => {

  const supabase = createClient();

  const { data, error } = await supabase
    .from("banners")
    .select("*")

  // console.log()

  if (!data) {
    console.error(error)
    return { data, error }
  }

  else {
    // console.log('getBanners/data: ', data);
    return {
      data: data,
      error: null
    }
  }

}