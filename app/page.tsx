import CssBaseline from "@mui/material/CssBaseline";

import Products from "./products/page";
import BackgroundBanner from "./_components/BackgroundBanner";
import { Gutter } from "./_components/Gutters";

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
  });

  return (
    <CssBaseline>
      <Gutter
        className="gutter-spacer"
        sx={{
          alignSelf: "flex-start"
        }}
      />
      <BackgroundBanner bannerData={bannerData} />
      <Products />
      <Gutter
        className="gutter-spacer"
        sx={{
          alignSelf: "flex-end"
        }}
      />
    </CssBaseline>
  )
}
