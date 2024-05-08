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

import getBanners from "@/utils/supabase/clientActions/getBanners";
import getBannerUrls from "@/utils/supabase/clientActions/getBannerUrls";


export default function Banner() {

  const [banners, setBanners] = useState<string[]>([])
  const [activeStep, setActiveStep] = useState<number>(0)
  const maxSteps = banners?.length;

  useEffect(() => {
    (async () => {
      const bannerNames = await getBanners();
      const bannerUrls = await getBannerUrls(bannerNames);

      setBanners(bannerUrls);
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
          width={250}
          height={250}
        >
        </Image>
      </Box>
      <MobileStepper
        steps={maxSteps}
        activeStep={activeStep}
        nextButton={
          <IconButton
            onClick={handleNext}
          >
            <KeyboardArrowRight />
          </IconButton>
        }
        backButton={
          <IconButton
            onClick={handleBack}
          >
            <KeyboardArrowLeft />
          </IconButton>
        }
      />
    </Paper>
  )

}