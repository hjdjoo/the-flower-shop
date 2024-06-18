"use client"

import { useEffect, useState } from "react";

import { useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";


import Products from "./products/page";
import BackgroundBanner from "./_components/BackgroundBanner";

import useBreakpoints from "@/utils/hooks/useBreakpoints";

import getHomepageCategories from "@/utils/supabase/clientActions/getHomepageCategories";
import { getBanners } from "@/utils/supabase/clientActions/getBanners";
import { getUrls } from "@/utils/supabase/clientActions/getUrls";
import { BannerData } from "./types/client-types";


export default function Main() {

  const { mobile, tablet, large, xlarge } = useBreakpoints();

  const [bannerData, setBannerData] = useState<BannerData[]>([])

  const getGutterWidth = (): string => {
    if (mobile) return "0%";
    if (tablet) return "0%";
    if (large) return "10%";
    if (xlarge) return "15%";
    else return "15%";
  }

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


  return (
    <CssBaseline>
      <Box
        className="gutter-spacer"
        position="fixed"
        alignSelf={"flex-start"}
        height="100vh"
        width={() => {
          return getGutterWidth();
        }}
        zIndex={2}
        sx={{
          backgroundColor: "#E8E8E8"
        }}
      />

      <BackgroundBanner bannerData={bannerData} />
      <Products />
      <Box
        className="gutter-spacer"
        position="fixed"
        alignSelf={"flex-end"}
        width={() => {
          return getGutterWidth();
        }}
        height="100vh"
        zIndex={2}
        sx={{
          backgroundColor: "#E8E8E8"
        }}
      />
    </CssBaseline>
  )
}
