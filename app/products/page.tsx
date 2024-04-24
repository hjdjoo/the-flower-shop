"use client"

import { useState, useEffect } from "react";
import { Carousel } from "@/app/_components/Carousel";
import { Suspense } from "react";
import getHomepageCategories from "@/utils/supabase/clientActions/getHomepageCategories";

import { HomepageCategory } from "../types/client-types";

// import { getImageUrls } from "@/utils/supabase/getImageUrls";

console.log("@products/page.tsx: ", "entering Products page");

export default function Products() {

  const [homepageCategories, setHomepageCategories] = useState<HomepageCategory[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await getHomepageCategories();

      if (error || !data) {
        throw new Error(`Couldn't get homepage categories! Error: ${error?.message}`)
      }
      setHomepageCategories([...data]);
    })()
  })

  const productCarousels = homepageCategories.map((cat, idx) => {
    return (
      <Suspense
        key={`category-suspense-${idx + 1}`}
        fallback={<p>Loading Products...</p>}>
        <Carousel category={cat}></Carousel>
      </Suspense>
    )

  })

  return (
    <>
      {productCarousels}
    </>
  )
}