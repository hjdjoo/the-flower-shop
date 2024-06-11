"use client"

import { useEffect, useState } from "react";

import Products from "./products/page";
import BackgroundBanner from "./_components/BackgroundBanner";


import getHomepageCategories from "@/utils/supabase/clientActions/getHomepageCategories";
import { getBanners } from "@/utils/supabase/clientActions/getBanners";
import { getUrls } from "@/utils/supabase/clientActions/getUrls";
import { BannerData } from "./types/client-types";
import Container from "@mui/material/Container";


export default function Main() {

  const [bannerData, setBannerData] = useState<BannerData[]>([])

  useEffect(() => {
    (async () => {
      const { data: banners } = await getBanners();

      if (!banners) {
        throw new Error("Couldn't get banners!")
      }

      let { data: bannerUrls } = await getUrls(banners, "banner_images");

      if (!bannerUrls) {
        bannerUrls = [];
      }

      const data = banners.map((banner, idx) => {
        return {
          name: banner,
          url: bannerUrls[idx]
        }
      })

      setBannerData(data);
    })()
  }, [])

  useEffect(() => {
    console.log("navigator: ", navigator);
    // document.querySelector()
  }, [])


  return (
    <Container id="main-box"
      disableGutters
      sx={{
        padding: "15px",
        margin: 0,
        // maxWidth: 
      }}
    >
      <BackgroundBanner bannerData={bannerData} />
      <Products />
    </Container>
  )
}
