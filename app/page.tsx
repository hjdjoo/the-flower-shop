import CssBaseline from "@mui/material/CssBaseline";

import Products from "./products/page";
import BackgroundBanner from "./_components/BackgroundBanner";
import { Gutter } from "./_components/Gutters";

import { getBanners } from "@/utils/supabase/clientActions/getBanners";
import { getUrls } from "@/utils/supabase/clientActions/getUrls";



export default async function Main() {

  const { data, error } = await getBanners();

  if (!data) {
    console.error(error.message)
    throw new Error("Couldn't get banners!")
  }

  // let { data: bannerUrls } = getUrls(banners, "banner_images", "png");

  // if (!bannerUrls) {
  //   bannerUrls = [];
  // }
  // console.log("Main/getBanners/data: ", data);

  const bannerData = data.map((banner, idx) => {
    return {
      name: banner.name!,
      url: banner.img_url!
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
