import { createClient } from "../client";

export default async function getBannerUrls(banners: string[]): Promise<string[]> {

  const supabase = createClient();

  const urls: string[] = [];

  banners.forEach(async (banner) => {

    const { data } = await supabase
      .storage
      .from("banner_images")
      .getPublicUrl(banner);

    urls.push(data.publicUrl);

  })

  return urls;

};