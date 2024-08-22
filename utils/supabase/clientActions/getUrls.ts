import { createClient } from "../client";
import { SupabaseResponse } from "@/app/types/db-types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

/**
 * 
 * @param imgNames :string[]; array of image names without extension
 * @param bucketFolder :string; the name of the supabase storage bucket where the file is stored.
 * @param fileType :string; the extension for these files.
 * @returns an array of URLs for these particular files.
 * This has been converted to a synchronous function, since supabase file URLs are predictable and consistent.
 */
export const getUrls = (imgNames: string[], bucketFolder: string, fileType: string = "jpeg"): SupabaseResponse<string[]> => {
  if (!bucketFolder) {
    throw new Error("Must specify an image folder");
  }
  // const supabase = createClient();
  const urls: string[] = imgNames.map(img => {
    return `${SUPABASE_URL}/storage/v1/object/public/${bucketFolder}/${img}.${fileType}`
  });

  return {
    data: urls,
    error: null
  };
}

