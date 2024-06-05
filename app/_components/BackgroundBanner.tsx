"use client"

import { useEffect, useState, useRef } from "react"

import Image from "next/image";
import type { ImageLoaderProps } from "next/image";

import { useTheme } from "@mui/material";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/Button';

import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";

import * as CarouselComp from "@/app/_components/styled/CarouselComponents";

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import normalizeCasing from "@/utils/actions/normalizeCasing";
import getWindowSize from "@/utils/actions/getWindowSize";

import type { WindowSize, BannerData } from "../types/client-types";

interface BackgroundBannerProps {
  bannerData: BannerData[]
}

export default function BackgroundBanner(props: BackgroundBannerProps) {

  const theme = useTheme();
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
      setActiveStep((prevStep) => {
        return prevStep + 1 === bannerData.length ? 0 : prevStep + 1;
      });
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
      left: currWindow.width * activeStep
    })
  }

  const handleScroll = (carouselName: string, translateX: number) => {

    const carousel = document.getElementById(`${carouselName}-carousel`)

    if (carousel?.scrollLeft === windowSize.width && translateX > 0) {
      carousel?.scrollTo({ left: 0, behavior: "smooth" })
    }
    else if (carousel?.scrollLeft === 0 && translateX < 0) {

      carousel?.scrollTo({ left: windowSize.width * (bannerData.length - 1), behavior: "smooth" })
    }
    else {
      carousel?.scrollBy({
        left: (translateX),
        top: 0,
        behavior: 'smooth'
      })
    }

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
            onClick={() => {

            }}
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
            display="flex"
            justifyContent="center"
            zIndex={1}
          >
            <ButtonBase
              className="banner-link"
              sx={{
                height: "10%",
                maxWidth: "60%",
                borderBottom: "1px solid white",
                borderTop: "1px solid white",
                color: "white",
                marginBottom: "15px",
                position: "absolute",
              }}
            >
              <Typography
                sx={{
                  color: theme.palette.secondary.main,
                  fontStyle: "italic",
                  textShadow: "1px 1px 3px grey",
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "0.7rem"
                  },
                  [theme.breakpoints.down("md")]: {
                    fontSize: "0.8rem"
                  },
                }}
              >
                Shop {bannerNames[idx]} Flowers {">>"}
              </Typography>
            </ButtonBase>
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
          onClick={() => {
            const newWindowSize = getWindowSize();
            setWindowSize(newWindowSize);
            setActiveStep((prevStep) => {
              return prevStep - 1 < 0 ? bannerData.length - 1 : prevStep - 1;
            });
            handleScroll("banner", -newWindowSize.width)
          }
          }
          disableRipple
        >
          <KeyboardArrowLeft
            sx={{
              fontSize: "2.5rem",
              color: "white"
            }}
          />
        </IconButton>
        <IconButton
          onClick={() => {
            const newWindowSize = getWindowSize();
            setWindowSize(newWindowSize);
            setActiveStep((prevStep) => {
              return prevStep + 1 === bannerData.length ? 0 : prevStep + 1;
            });
            handleScroll("banner", newWindowSize.width)
          }}
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