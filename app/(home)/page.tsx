import { Carousel } from "../_components/Carousel";
import { Suspense } from "react";



export default async function Home() {

  const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/image-urls`, {
    method: "GET"
  });

  console.log('(home)/Home/fetch/data: ', data)
  const imageUrls = await data.json();


  return (
    <div>
      <h1>Home</h1>
      <Suspense fallback={<p>Loading Images...</p>}>
        <Carousel imageUrls={imageUrls}></Carousel>
      </Suspense>
    </div>
  )
}

