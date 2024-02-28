import { createClient } from '@supabase/supabase-js'

const { SUPABASE_URL, SUPABASE_KEY } =
  process.env;

const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!, {
})

export async function getImageUrls() {
  try {
    // get images from supabase;
    const { data, error } = await supabase
      .storage
      .from('products')
      .list('arrangements', {
        limit: 10,
        offset: 1
      })

    // console.log('api/image-urls/route.ts/GET/data: ', data)

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
  catch (err) {
    console.error(err);
    return err;
  }
}