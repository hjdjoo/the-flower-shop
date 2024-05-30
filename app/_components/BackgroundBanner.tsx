"use client"

import { useEffect, useState, useRef } from "react"

import Image from "next/image";
import type { ImageLoaderProps } from "next/image";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import normalizeCasing from "@/utils/actions/normalizeCasing";

import getWindowSize from "@/utils/actions/getWindowSize";

import type { WindowSize, BannerData } from "../types/client-types";

interface BackgroundBannerProps {
  bannerData: BannerData[]
}

export default function BackgroundBanner(props: BackgroundBannerProps) {

  const { bannerData } = props;

  const bannerNames = bannerData.map(banner => {
    // the "replace" method is taking the extensions (.jpg, .png, etc) and removing it.
    return normalizeCasing(banner.name.replace(/(\..*)$/, ""))
  })

  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0
  });

  const [activeStep, setActiveStep] = useState<number>(0)

  useEffect(() => {
    const window = getWindowSize();
    setWindowSize(window);

  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveStep((prevStep) => {
        return prevStep + 1 === bannerData.length ? 0 : prevStep + 1;
      });
    }, 6000)
    return () => {
      clearInterval(intervalId);
    }
  })

  const handleBack = () => {
    setActiveStep(activeStep - 1 < 0 ? bannerData.length - 1 : activeStep - 1);
  }

  const handleNext = () => {
    setActiveStep(activeStep + 1 === bannerData.length ? 0 : activeStep + 1);
  }

  return (

    <Box
      className="banner-box"
      position={"absolute"}
      sx={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        zIndex: -1
      }}
    >
      <Image
        id="background-image"
        className="banner-image"
        loader={({ src }: ImageLoaderProps): string => {
          return `${src}`
        }}
        src={bannerData[activeStep].url}
        onClick={() => {

        }}
        alt="promotional image"
        sizes="100vw"
        style={{
          zIndex: -1,
        }}
        fill
        priority
      />
      <Box
        className="banner-navigation"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <IconButton
          onClick={handleBack}
          disableRipple
        >
          <KeyboardArrowLeft
            sx={{
              fontSize: "2.5rem",
              color: "white"
            }}
          />
        </IconButton>
        {/* Need to add routing/navigation functionality to buttons; the banner names should be category names (meaning the banner upload form should specify categories to upload banners for, rather than simply a filename.) */}
        <ButtonBase
          sx={{
            height: "10%",
            maxWidth: "60%",
            borderBottom: "1px solid white",
            borderTop: "1px solid white",
            color: "white",
            marginBottom: "15px"
          }}
        >
          <Typography
            sx={{
              fontStyle: "italic",
              textShadow: "1px 1px 3px grey"
            }}
          >
            Shop {bannerNames[activeStep]} Flowers {">>"}
          </Typography>
        </ButtonBase>
        <IconButton
          onClick={handleNext}
          disableRipple
        >
          <KeyboardArrowRight
            sx={{
              fontSize: "2.5rem",
              color: "white"
            }}
          />
        </IconButton>
      </Box>
    </Box>

  )

}