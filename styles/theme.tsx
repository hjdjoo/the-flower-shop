'use client'

declare module '@mui/material/styles' {
  interface Theme {
  }
  interface ThemeOptions {
  }
}

import { createTheme } from "@mui/material/styles";
import { Theme } from "@emotion/react";
import { Sacramento, Urbanist } from "next/font/google"

export const urbanist = Urbanist({
  weight: ["100", "200", "300", "400"],
  style: ["normal", "italic"],
  subsets: ["latin"]
})


const theme: Theme = createTheme({
  palette: {
    primary: {
      main: "#003d03"
    },
    secondary: {
      main: "#660061"
    },
  },
  typography: {
    fontFamily: urbanist.style.fontFamily
  }
})

export default theme;