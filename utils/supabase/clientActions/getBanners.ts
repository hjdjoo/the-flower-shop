import { createClient } from "../client";

export default async function getBanners(): Promise<string[]> {

  const supabase = createClient();

  const { data, error } = await supabase
    .storage
    .from("banner_images")
    .list()

  if (error) {
    throw new Error(`Couldn't get banners from db: ${error.message}`)
  }

  else {
    // const banners = data
    console.log('getBanners/data: ', data);
    return [];
  }

}