"use client"

import { styled } from "@mui/material/styles";

import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";


// use to center grid items into columns
export const GridItem = styled(Grid, {
  name: "GridItem"
})(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
})) as typeof Grid

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