'use client'

declare module '@mui/material/styles' {
  interface Theme {
  }
  interface ThemeOptions {
  }
}

import { createTheme } from "@mui/material/styles";
import { Theme } from "@emotion/react";
import { Open_Sans as OpenSans } from "next/font/google"

export const openSans = OpenSans({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"]
})

const theme: Theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 550,
      md: 850,
      lg: 1080,
      xl: 1200
    }
  },
  palette: {
    primary: {
      main: "#003d03",
      light: "#F0FEF1",
    },
    secondary: {
      main: "#FFF0FD"
    },
    info: {
      main: "#789E7A"
    }
  },
  typography: {
    fontFamily: openSans.style.fontFamily
  },

})

export default theme;