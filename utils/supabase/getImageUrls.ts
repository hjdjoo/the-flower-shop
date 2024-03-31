// Refactor to use updated supabase/ssr package

import { createClient } from "@supabase/supabase-js";

const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } =
  process.env;

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL!, NEXT_PUBLIC_SUPABASE_ANON_KEY!);

console.log('about to enter getImageUrls...')

export async function getImageUrls(): Promise<string[] | undefined> {

  // get images from supabase;
  const { data, error } = await supabase
    .storage
    .from('products')
    .list('arrangements', {
      limit: 10,
      offset: 1
    })

  if (error) {
    throw new Error("Couldn't get images")
  }
  // console.log('supabase/getImageUrls ', data)

  const urls: string[] | undefined = data?.map((img) => {
    const url = supabase.storage
      .from('products/arrangements')
      .getPublicUrl(img.name);
    // console.log('serverActions/getImages/urls/map/url: ', url)
    return url.data.publicUrl;
    // return img.name
  })
  return urls;

}