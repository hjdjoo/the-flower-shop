import { Carousel } from "@/app/_components/Carousel";
import { Suspense } from "react";


// const getImageUrls = async () => {


// }

export default async function Home() {

  // console.log('process.env.URL: ', process.env.URL)
  console.log('(home)/page: sending fetch request to API')

  const data = await fetch(`${process.env.URL}/api/image-urls`, {
    method: "GET",
    cache: 'no-cache'
  });

  const imageUrls = await data.json();

  // console.log('page/(home)/imageUrls: ', imageUrls)

  return (
    <div>
      <h1>Home</h1>
      <Suspense fallback={<p>Loading Images...</p>}>
        <Carousel imageUrls={imageUrls}></Carousel>
      </Suspense>
    </div>
  )
}

