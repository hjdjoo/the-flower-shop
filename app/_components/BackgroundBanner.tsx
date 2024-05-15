"use client"

import { useEffect, useState, useRef } from "react"

import Image from "next/image";
import type { ImageLoaderProps } from "next/image";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import getWindowSize from "@/utils/actions/getWindowSize";

import type { WindowSize, BannerData } from "../types/client-types";

interface BackgroundBannerProps {
  bannerData: BannerData[]
}

export default function BackgroundBanner(props: BackgroundBannerProps) {

  const { bannerData } = props;

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
      position={"absolute"}
      sx={{
        width: windowSize.width,
        height: windowSize.width * (3 / 4),
        overflow: "hidden",
        display: "flex",
      }}
    >
      <Image
        id="background-image"
        loader={({ src }: ImageLoaderProps): string => {
          return `${src}`
        }}
        src={bannerData[activeStep].url}
        onClick={() => {

        }}
        alt="promotional image"
        style={{
          objectFit: "contain",
          zIndex: -1
        }}
        priority
        fill
      />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: "10%"
        }}
      >
        <IconButton>
          <KeyboardArrowLeft
            sx={{
              fontSize: "2.5rem",
              color: "white"
            }}
          />
        </IconButton>
        <IconButton>
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