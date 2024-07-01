"use client"

import Box from "@mui/material/Box";
import { styled } from "@mui/material";

export const Gutter = styled(Box, {
  name: "GutterLeft",
  slot: "root"
})(({ theme }) => ({
  position: "absolute",
  height: "100vh",
  [theme.breakpoints.between("xs", "sm")]: {
    width: "0%"
  },
  [theme.breakpoints.between("sm", "md")]: {
    width: "0%"
  },
  [theme.breakpoints.between("md", "lg")]: {
    width: "10%"
  },
  [theme.breakpoints.up("lg")]: {
    width: "15%"
  },
}))