import { Carousel } from "../_components/Carousel";
import { Suspense } from "react";


import { getImageUrls } from "@/utils/supabase/getImageUrls";
import { createClient } from "@/utils/supabase/client";
// import { createClient } from "@/utils/supabase/server";

export default async function Home() {

  // console.log(`${process.env.NEXT_PUBLIC_URL}/api/image-urls`)

  const imageUrls = await getImageUrls();

  const supabase = createClient();

  const { data, error } = await supabase.auth.getSession();

  console.log('Home/page/supabase.auth.getUser/data: ', data)

  // console.log('(home)/Home/fetch/data: ', imageUrls);
  // const imageUrls = await data.json();

  return (
    <div>
      <h1>Home</h1>
      {/* Add splash banner at top of page. */}
      <Suspense fallback={<p>Loading Products...</p>}>
        <Carousel imageUrls={imageUrls}></Carousel>
      </Suspense>
    </div>
  )
}

