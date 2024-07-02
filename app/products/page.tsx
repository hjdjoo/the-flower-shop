"use client"

import { useState, useEffect } from "react";
import { Suspense } from "react";

import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";

import { Carousel } from "@/app/_components/Carousel";

import { HomepageCategory } from "../types/client-types";

import useBreakpoints from "@/utils/hooks/useBreakpoints";

import getHomepageCategories from "@/utils/supabase/clientActions/getHomepageCategories";
import getWindowSize from "@/utils/actions/getWindowSize";

// import { getImageUrls } from "@/utils/supabase/getImageUrls";

// console.log("@products/page.tsx: ", "entering Products page");

export default function Products() {

  const theme = useTheme();
  const [homepageCategories, setHomepageCategories] = useState<HomepageCategory[]>([]);

  const { mobile, tablet, large, xlarge } = useBreakpoints();

  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    (async () => {
      const { data, error } = await getHomepageCategories();

      if (error || !data) {
        throw new Error(`Couldn't get homepage categories! Error: ${error?.message}`)
      }
      // console.log("products/page/useEffect/data: ", data);
      setHomepageCategories([...data]);
    })()

    const window = getWindowSize();
    setWindowSize(window);

  }, [])

  const bestsellers = homepageCategories.filter((cat, idx) => {
    return cat.name === "Bestsellers"
  })

  const bestsellersCarousel = (bestsellers: HomepageCategory[]) => {
    if (!bestsellers.length) return;
    // console.log(bestsellers[0]);
    return (
      <Suspense
        fallback={<p>Loading Products...</p>}>
        <Carousel category={bestsellers[0]}></Carousel>
      </Suspense>
    )
  }

  const productCarousels = homepageCategories.filter(cat => cat.name !== "Bestsellers").map((cat, idx) => {
    return (
      <Suspense
        key={`category-suspense-${idx + 1}`}
        fallback={<p>Loading Products...</p>}>
        <Carousel category={cat}></Carousel>
      </Suspense>
    )

  })

  return (
    <Box
      id="product-box"
      width="100%"
      className="product-box"
      marginTop={() => {
        if (mobile) return "53%";
        if (tablet) return "55%";
        if (large) return "43%";
        if (xlarge) return "39%";
      }}
      zIndex={2}
    >
      {bestsellersCarousel(bestsellers)}
      {productCarousels}
    </Box>
  )
}