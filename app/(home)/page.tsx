import { Carousel } from "../_components/Carousel";
import { Suspense } from "react";

import { getImageUrls } from "@/utils/supabase/getImageUrls";



export default async function Home() {

  // console.log(`${process.env.NEXT_PUBLIC_URL}/api/image-urls`)

  const imageUrls = await getImageUrls();

  // console.log('(home)/Home/fetch/data: ', imageUrls);
  // const imageUrls = await data.json();

  return (
    <div>
      <h1>Home</h1>
      <Suspense fallback={<p>Loading Images...</p>}>
        <Carousel imageUrls={imageUrls}></Carousel>
      </Suspense>
    </div>
  )
}

