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
    console.log('getBanners/data: ', data);
    const banners = data.filter((banner) => banner.name !== ".emptyFolderPlaceholder").map((banner) => {
      return banner.name
    })
    return banners
  }
}