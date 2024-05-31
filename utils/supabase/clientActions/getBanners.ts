import { cache } from "react";

import { createClient } from "../client";
import { SupabaseResponse } from "@/app/types/db-types";

export const revalidate = 3600

export const getBanners = cache(async (): Promise<SupabaseResponse<string[]>> => {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .storage
      .from("banner_images")
      .list()

    if (error) {
      throw new Error(`Couldn't get banners from db: ${error.message}`)
    }

    else {
      // console.log('getBanners/data: ', data);
      const banners = data.filter((banner) => banner.name !== ".emptyFolderPlaceholder").map((banner) => {
        return banner.name
      })
      return {
        data: banners,
        error: null
      }
    }
  }
  catch (error) {
    return {
      data: null,
      error: error
    }
  }
})