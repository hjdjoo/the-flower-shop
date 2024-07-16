import { createClient } from "../client";
import { SupabaseResponse } from "@/app/types/db-types";

// const SUPABASE_URL = process.env.SUPABASE_URL

export const getUrls = async (imgNames: string[], bucketFolder: string): Promise<SupabaseResponse<string[]>> => {
  if (!bucketFolder) {
    throw new Error("Must specify an image folder");
  }
  try {
    const supabase = createClient();
    const urls: string[] = [];

    imgNames.forEach(async (img) => {

      const { data } = await supabase
        .storage
        .from(`${bucketFolder}`)
        .getPublicUrl(img);

      urls.push(data.publicUrl);
    })

    return {
      data: urls,
      error: null
    };
  }
  catch (error) {
    return {
      data: null,
      error: error
    }
  };
}

