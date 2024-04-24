import { createClient } from "../client"

// console.log('about to enter getUrls...')

export async function getUrl(product: string) {

  const supabase = createClient();

  const { data } = await supabase
    .storage
    .from("products")
    .getPublicUrl(product);

  return data.publicUrl;

}