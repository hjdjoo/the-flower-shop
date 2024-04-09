import { Carousel } from "@/app/_components/Carousel";
import { Suspense } from "react";

// import { getImageUrls } from "@/utils/supabase/getImageUrls";

console.log("@products/page.tsx: ", "entering Products page");

export default async function Products() {


  // get homepage products from database;
  // should have a "category" value that can be read and passed to the carousel.

  // map homepage products to carousels.

  // format to return: 



  return (
    <>
      <Suspense fallback={<p>Loading Products...</p>}>
        <Carousel category={""}></Carousel>
      </Suspense>
    </>
  )
}