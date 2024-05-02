'use client'

declare module '@mui/material/styles' {
  interface Theme {
  }
  interface ThemeOptions {
  }
}

import { createTheme } from "@mui/material/styles";
import { Theme } from "@emotion/react";
import { Lato } from "next/font/google"

export const lato = Lato({
  weight: ["100", "300", "400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"]
})

const theme: Theme = createTheme({
  palette: {
    primary: {
      main: "#003d03",
      light: "#ebfaeb",
    },
    secondary: {
      main: "#660061"
    },
  },
  typography: {
    fontFamily: lato.style.fontFamily
  },
})

export default theme;