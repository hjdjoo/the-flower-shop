"use client"

import { useEffect, useState } from "react";

import Box from "@mui/material/Box";

import getWindowSize from "@/utils/actions/getWindowSize";
import type { WindowSize } from "../types/client-types";

export default function BannerSpacer() {

  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0
  });

  useEffect(() => {
    const window = getWindowSize();
    setWindowSize(window);
  }, []);


  return (
    <Box
      className="banner-spacer"
    />
  )
}