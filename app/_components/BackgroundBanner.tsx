"use client"

import { useEffect, useState, useRef } from "react"

import Image from "next/image";
import type { ImageLoaderProps } from "next/image";
import { useRouter } from "next/navigation";

import { useTheme } from "@mui/material";

import Box from '@mui/material/Box';
import IconButton from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import * as CarouselComp from "@/app/_components/styled/CarouselComponents";
import { BannerButton, BannerStepConnector, BannerStepIcon, } from "@/app/_components/styled/BannerComponents";


import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
// import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
// import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import useBreakpoints from "@/utils/hooks/useBreakpoints";
import normalizeCasing from "@/utils/actions/normalizeCasing";
import getWindowSize from "@/utils/actions/getWindowSize";

import type { WindowSize, BannerData } from "../types/client-types";

interface BackgroundBannerProps {
  bannerData: BannerData[]
}

export default function BackgroundBanner(props: BackgroundBannerProps) {

  const router = useRouter();
  const theme = useTheme();
  const { mobile, tablet, large, xlarge } = useBreakpoints();
  const { bannerData } = props;
  const activeIdx = useRef<number>(0)
  const [activeStep, setActiveStep] = useState<number>(0)
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
      left: currWindow.width * activeIdx.current
    })
  }

  const handleScroll = (carouselName: string, translateX: number) => {

    const carousel = document.getElementById(`${carouselName}-carousel`)

    // if we're trying to scroll right, handle resetting the activeIdx ref and scroll behavior at the end of the carousel.
    // Invert logic if we're trying to scroll left.
    switch (translateX > 0) {
      case true:
        if (activeIdx.current === bannerData.length - 1) {
          activeIdx.current = 0;
          setActiveStep(0);
          carousel?.scrollTo({ left: 0, behavior: "smooth" })
        } else {
          activeIdx.current += 1;
          setActiveStep(activeStep + 1)
          carousel?.scrollBy({
            left: (translateX),
            top: 0,
            behavior: 'smooth'
          })
        }
        break;
      case false:
        if (carousel?.scrollLeft === 0) {
          activeIdx.current = bannerData.length - 1;
          setActiveStep(bannerData.length - 1);
          carousel?.scrollTo({ left: windowSize.width * (bannerData.length - 1), behavior: "smooth" })
        } else {
          activeIdx.current -= 1;
          setActiveStep(activeStep + 1);
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
          minWidth={() => {
            if (mobile || tablet) return "100vw";
            if (large) return "80vw";
            if (xlarge) return "70vw";
          }}
          position="relative"
        >
          <Image
            id="background-image"
            className="responsive-image"
            loader={({ src, width }: ImageLoaderProps): string => {
              return `${src}?w=${width}`
            }}
            src={data.url}
            alt="promotional image"
            style={{
              zIndex: -1,
            }}
            sizes={
              "(max-width: 900px) 80%, (max-width: 1200px) 70%, 70%"
            }
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
                router.push(`/categories/${bannerNames[activeIdx.current]}`)
              }}
              sx={{
                fontWeight: "500",
                fontStyle: "italic",
              }}
            >
              Shop {bannerNames[idx]} Flowers {">"}
            </BannerButton>
          </Box>
        </Box>
      </CarouselComp.CarItem>
    )
  })

  const BannerStepper = () => {
    return (
      <Stepper
        alternativeLabel
        activeStep={activeIdx.current}
        connector={<BannerStepConnector />}
      >
        {bannerData.map((item, idx) => {
          return (<Step
            key={`step-${idx + 1}`}
          >
            <StepLabel StepIconComponent={BannerStepIcon} />
          </Step>)
        })}
      </Stepper>
    )
  }

  const getNavArrowSize = () => {
    if (mobile || tablet) return "48px";
    if (large) return "56px";
    if (xlarge) return "64px";
  }


  return (

    <Box
      id="background-banner-box"
      className="banner-box"
      position={"absolute"}
      marginTop="25px"
      sx={{
        paddingX: () => {
          if (mobile || tablet) return "0%";
          if (large) return "10%";
          if (xlarge) return "15%";
        },
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        zIndex: 1
      }}
    >
      <CarouselComp.CarBox
        id="banner-carousel"
        sx={{
          padding: "0px",
        }}
      >
        {bannerImages}
      </CarouselComp.CarBox>
      <Box
        id="banner-navigation"
        sx={{
          width: () => {
            if (mobile || tablet) return "100vw";
            if (large) return "80vw";
            if (xlarge) return "70vw";
          },
          display: "flex",
          flexDirection: "row",
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
          }}
          disableRipple
          sx={{
            padding: 0,
            width: () => {
              return getNavArrowSize();
            },
            height: () => {
              return getNavArrowSize();
            },
            left: "1%"
          }}
        >
          <ArrowBackIosOutlinedIcon
            className="arrow-icon"
            sx={{
              fontSize: () => {
                if (mobile || tablet) return "1.5rem";
                if (large) return "1.8rem";
                if (xlarge) return "2rem";
              },
              color: "white",
            }}
          />
        </IconButton>
        <Box id="banner-stepper-box"
          sx={{
            transform: () => {
              if (mobile) return "translateY(calc(0.3vh))"
              if (tablet) return "translateY(calc(1.3vh))"
              if (large) return "translateY(calc(1.1vh))"
              if (xlarge) return "translateY(calc(2vh))"
            },
          }}
        >
          <BannerStepper />
        </Box>
        <IconButton
          id="next-banner-button"
          className="nav-arrow"
          onClick={() => {
            const newWindowSize = getWindowSize();
            handleScroll("banner", newWindowSize.width)
          }}
          disableRipple
          sx={{
            position: "relative",
            padding: 0,
            width: () => {
              return getNavArrowSize();
            },
            height: () => {
              return getNavArrowSize();
            },
            right: "1%"
          }}
        >
          <ArrowForwardIosOutlinedIcon
            className="arrow-icon"
            sx={{
              fontSize: () => {
                if (mobile) return "1.5rem";
                if (large) return "1.8rem";
                if (xlarge) return "2rem";
              },
              color: "white"
            }}
          />
        </IconButton>
      </Box>
    </Box >

  )

}