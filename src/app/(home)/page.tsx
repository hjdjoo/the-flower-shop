import { Carousel } from "@/app/components/Carousel";
// import { getImages } from "../actions/serverActions";
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from "react";


export const getImages: () => Promise<string[] | undefined> = cache(async (): Promise<string[] | undefined> => {

  const cookieStore = cookies();
  const { SUPABASE_URL, SUPABASE_KEY } =
    process.env;
  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_KEY!, {
    cookies: {
      get(name: string) {
        // console.log('serverActions/getImages/createServerclient/cookies/name: ', name)
        return cookieStore.get(name)?.value
      }
    }
  })
  try {
    // get images from supabase;
    const { data, error } = await supabase
      .storage
      .from('products')
      .list('arrangements', {
        limit: 3,
        offset: 1
      })

    // console.log('page/data: ', data)

    // console.log('serverActions/getImages/supabase/data: ', data);
    // let imgUrls = [];

    const urls: string[] | undefined = data?.map((img) => {
      const url = supabase.storage
        .from('products')
        .getPublicUrl(img.name, {
          transform: {
            width: 150,
            height: 150
          }
        });
      // console.log('serverActions/getImages/urls/map/url: ', url)
      return url.data.publicUrl;
      // return img.name
    })
    console.log('getImages/urls: ', urls)
    return urls;
  }
  catch (err) {
    console.error(err);
    // return err;
  }
})


export default async function Home() {

  const imageUrls = await getImages();

  console.log('page/Home/imageUrls: ', imageUrls)

  return (
    <div>
      <h1>Home</h1>
      <Carousel imageUrls={imageUrls}></Carousel>
    </div>
  )
}

