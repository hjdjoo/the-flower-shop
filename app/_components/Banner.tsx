import { useEffect, useState, useRef } from "react"

import Image from "next/image";
import type { ImageLoaderProps } from "next/image";

import MobileStepper from "@mui/material/MobileStepper";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import getWindowSize from "@/utils/actions/getWindowSize";
import getBanners from "@/utils/supabase/clientActions/getBanners";
import getBannerUrls from "@/utils/supabase/clientActions/getBannerUrls"

import type { WindowSize } from "../types/client-types";

export default function Banner() {

  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0
  })
  const [banners, setBanners] = useState<string[]>([])
  const [activeStep, setActiveStep] = useState<number>(0)
  const maxSteps = banners.length;

  useEffect(() => {
    const window = getWindowSize();
    setWindowSize(window);

    (async () => {
      const bannerNames = await getBanners();
      // const bannerUrls = await getBannerUrls(bannerNames);

      // setBanners(bannerUrls);
    })()

  }, [])

  const handleBack = () => {
    setActiveStep((activeStep - 1) % maxSteps)
  }

  const handleNext = () => {
    setActiveStep((activeStep + 1) % maxSteps)
  }

  return (
    <Paper
      id="promo-banner-container"
    >
      <Box
        position={"relative"}
      >
        <Image
          loader={({ src, width }: ImageLoaderProps): string => {
            return `${src}?w=${width}`
          }}
          src={banners[activeStep]}
          alt="promotional image"
          style={{
            objectFit: "fill"
          }}
          width={windowSize.width * 0.93}
          height={windowSize.height / 2}
        >
        </Image>
      </Box>
    </Paper>
  )

}