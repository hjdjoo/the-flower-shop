// "use client"
import Products from "./products/page";
import BackgroundBanner from "./_components/BackgroundBanner";
import BannerSpacer from "./_components/BannerSpacer";
import Head from "next/head";

import getHomepageCategories from "@/utils/supabase/clientActions/getHomepageCategories";
import { getBanners } from "@/utils/supabase/clientActions/getBanners";
import { getUrls } from "@/utils/supabase/clientActions/getUrls";


export default async function Main() {

  const { data: banners } = await getBanners();

  if (!banners) {
    throw new Error("Couldn't get banners!")
  }

  let { data: bannerUrls } = await getUrls(banners, "banner_images");

  if (!bannerUrls) {
    bannerUrls = [];
  }

  const bannerData = banners.map((banner, idx) => {
    return {
      name: banner,
      url: bannerUrls[idx]
    }
  })


  return (
    <>
      <BackgroundBanner bannerData={bannerData} />
      <BannerSpacer />
      <Products />
    </>
  )
}
