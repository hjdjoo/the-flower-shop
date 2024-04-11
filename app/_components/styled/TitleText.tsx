"use client"

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

// responsive title text for navbar;
export const TitleText = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.between('xs', 'sm')]: {
    fontSize: "0.8rem"
  },
  [theme.breakpoints.between('sm', 'md')]: {
    fontSize: "1.0rem"
  },
  [theme.breakpoints.between('md', 'lg')]: {
    fontSize: "1.4rem"
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: "1.4rem"
  }
}))