// import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from "next/server";
// import type { NextRequest, NextResponse } from 'next/server';

console.log('Entering api/image-urls/route.ts')

// type Data = string[] | undefined

export async function GET(req: NextRequest) {

  console.log('getting Image URLs...')
  // console.log('getHomepageImageUrls/request: ', req)
  // const cookieStore = cookies();
  const { SUPABASE_URL, SUPABASE_KEY } =
    process.env;

  const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!, {
  })

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
    console.log('/api/image-urls/route.ts/GET/urls: ', urls)

    return NextResponse.json(urls);

  }
  catch (err) {
    console.error(err);
    return NextResponse.json("Couldn't fetch URLs")
  }
}