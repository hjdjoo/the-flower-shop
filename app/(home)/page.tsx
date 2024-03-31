import { Carousel } from "../_components/Carousel";
import { Suspense } from "react";

import formJson from "@/utils/actions/parseCookie";


import { cookies } from "next/headers";


import { getImageUrls } from "@/utils/supabase/getImageUrls";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {

  const imageUrls = await getImageUrls();

  const supabase = createClient();

  const { data } = await supabase.auth.getSession();
  // console.log('Home/page/supabase.auth.getSession/data: ', data.session?.user.app_metadata)
  // console.log('Home/page/supabase.auth.getSession/error: ', error)

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

