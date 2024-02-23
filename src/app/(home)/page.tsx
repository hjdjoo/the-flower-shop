import { Carousel } from "@/app/components/Carousel";
import { Suspense } from "react";
import { createClient } from '@supabase/supabase-js'

const getImageUrls = async () => {

  console.log('getting Image URLs...')

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
        limit: 3,
        offset: 1
      })

    const urls: string[] | undefined = data?.map((img) => {
      const url = supabase.storage
        .from('products/arrangements')
        .getPublicUrl(img.name);
      // console.log('serverActions/getImages/urls/map/url: ', url)
      return url.data.publicUrl;
      // return img.name
    })
    console.log('getImages/urls: ', urls)
    return urls;

  }
  catch (err) {
    console.error(err);

  }
}


export default async function Home() {

  // console.log('process.env.URL: ', process.env.URL)
  console.log('(home)/page: sending fetch request to API')

  // const res = await fetch(`${process.env.URL}/api/homepageImageUrls`, {
  //   cache: "no-store",
  //   headers: {
  //     "Method": "GET"
  //   }
  // })

  const imageUrls = await getImageUrls();

  console.log('page/(home)/imageUrls: ', imageUrls)

  return (
    <div>
      <h1>Home</h1>
      <Suspense fallback={<p>Loading Images...</p>}>
        <Carousel imageUrls={imageUrls}></Carousel>
      </Suspense>
    </div>
  )
}

