"use client"

import { useEffect, useState, useRef } from "react"

import Image from "next/image";
import type { ImageLoaderProps } from "next/image";
import { useRouter } from "next/navigation";

import { useTheme } from "@mui/material";
import { keyframes } from "@mui/material";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/Button';

import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";

import * as CarouselComp from "@/app/_components/styled/CarouselComponents";
import { BannerButton } from "@/app/_components/styled/BannerComponents";


import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import normalizeCasing from "@/utils/actions/normalizeCasing";
import getWindowSize from "@/utils/actions/getWindowSize";

import type { WindowSize, BannerData } from "../types/client-types";

interface BackgroundBannerProps {
  bannerData: BannerData[]
}

export default function BackgroundBanner(props: BackgroundBannerProps) {

  const router = useRouter();
  const theme = useTheme();
  const { bannerData } = props;
  const activeStep = useRef<number>(0)
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0
  });

  const bannerNames = bannerData.map(banner => {
    // the "replace" method is taking the extensions (.jpg, .png, etc) and removing it.
    return normalizeCasing(banner.name.replace(/(\..*)$/, ""))
  })

  // useEffect for managing the carousel upon resizing
  useEffect(() => {
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize);
    }
  })

  // useEffect for setting up automatic carousel change
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currWindow = getWindowSize();
      setWindowSize(currWindow);
      handleScroll("banner", currWindow.width)
    }, 6000)
    return () => {
      clearInterval(intervalId);
    }
  })

  // due to flexbox behavior, carousel images would begin to shift upon resizing the window if the image displayed was not the first image. This handler scrolls the bg carousel to the currently active index.
  const handleResize = () => {
    const currWindow = getWindowSize();
    document.getElementById("banner-carousel")?.scrollTo({
      left: currWindow.width * activeStep.current
    })
  }

  const handleScroll = (carouselName: string, translateX: number) => {

    const carousel = document.getElementById(`${carouselName}-carousel`)

    // if we're trying to scroll right, handle resetting the activeStep ref and scroll behavior at the end of the carousel.
    // Invert logic if we're trying to scroll left.
    switch (translateX > 0) {
      case true:
        if (activeStep.current === bannerData.length - 1) {
          activeStep.current = 0;
          carousel?.scrollTo({ left: 0, behavior: "smooth" })
        } else {
          activeStep.current += 1;
          carousel?.scrollBy({
            left: (translateX),
            top: 0,
            behavior: 'smooth'
          })
        }
        break;
      case false:
        if (carousel?.scrollLeft === 0) {
          activeStep.current = bannerData.length - 1;
          carousel?.scrollTo({ left: windowSize.width * (bannerData.length - 1), behavior: "smooth" })
        } else {
          activeStep.current -= 1;
          carousel?.scrollBy({
            left: (translateX),
            top: 0,
            behavior: 'smooth'
          })
        }
        break;
    };
  };

  const bannerImages = bannerData.map((data, idx) => {
    return (
      <CarouselComp.CarItem
        key={`banner-item-${idx + 1}`}
        id="banner-carousel"
        sx={{
          margin: "0px"
        }}
      >
        <Box
          className="banner-item-box"
          minWidth="100vw"
        >
          <Image
            id="background-image"
            className="responsive-image"
            loader={({ src }: ImageLoaderProps): string => {
              return `${src}`
            }}
            src={data.url}
            alt="promotional image"
            // sizes="100vw"
            style={{
              zIndex: -1,
            }}
            fill
            priority
          />
          {/* Need to add routing/navigation functionality to buttons; the banner names should be category names (meaning the banner upload form should specify categories to upload banners for, rather than simply a filename.) */}
          <Box
            className="banner-link-box"
            display="flex"
            justifyContent="center"
            zIndex={1}
          >
            <BannerButton
              className="banner-link"
              disableRipple
              onClick={() => {
                router.push(`/categories/${bannerNames[activeStep.current]}`)
              }}
            >
              Shop {bannerNames[idx]} Flowers {">>"}
            </BannerButton>
          </Box>
        </Box>
      </CarouselComp.CarItem>
    )
  })

  return (

    <Box
      id="background-banner-box"
      className="banner-box"
      position={"absolute"}
      marginTop="25px"
      sx={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        zIndex: -1
      }}
    >
      <CarouselComp.CarBox
        id="banner-carousel"
        sx={{ padding: "0px" }}
      >
        {bannerImages}
      </CarouselComp.CarBox>
      <Box
        id="banner-navigation"
        sx={{
          display: "flex",
          flexDirection: "row",
          // alignSelf: "center-end",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <IconButton
          id="prev-banner-button"
          className="nav-arrow"
          onClick={() => {
            const newWindowSize = getWindowSize();
            setWindowSize(newWindowSize);
            handleScroll("banner", -newWindowSize.width)
          }
          }
          disableRipple
        >
          <KeyboardArrowLeft
            sx={{
              fontSize: "2.5rem",
              color: "white",
            }}
          />
        </IconButton>
        <IconButton
          id="next-banner-button"
          className="nav-arrow"
          onClick={() => {
            const newWindowSize = getWindowSize();
            handleScroll("banner", newWindowSize.width)
          }}
          disableRipple
        >
          <KeyboardArrowRight
            className="nav-arrow"
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