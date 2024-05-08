import { createClient } from "../client";

export default async function getBannerUrls(product: string): Promise<string> {

  const supabase = createClient();

  const { data } = await supabase
    .storage
    .from("products")
    .getPublicUrl(product)

  if (!data.publicUrl) {
    throw new Error(`Nothing found for ${product} in db`)
  }

  return data.publicUrl;

};