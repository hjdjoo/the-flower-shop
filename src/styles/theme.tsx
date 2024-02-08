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
    fontFamily: [
      'Sacramento',
      'Urbanist'
    ].join(',')
  }

})

export default theme;