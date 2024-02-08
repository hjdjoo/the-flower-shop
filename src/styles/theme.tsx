'use client'

declare module '@mui/material/styles' {
  interface Theme {
  }
  interface ThemeOptions {
  }
}

import { createTheme } from "@mui/material/styles";


const theme = createTheme({
  palette: {
    primary: {
      main: "#003d03"
    },
    secondary: {
      main: "#660061"
    }
  }


})

export default theme;