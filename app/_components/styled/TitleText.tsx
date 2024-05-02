"use client"

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

// responsive title text for navbar;
export const TitleText = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.between('xs', 'md')]: {
    fontSize: "1.4rem"
  },
  [theme.breakpoints.between('md', 'lg')]: {
    fontSize: "1.6rem"
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: "1.8rem"
  }
}))