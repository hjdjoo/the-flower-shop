"use client"

import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";

// use to center grid items into columns
export const GridItem = styled(Grid, {
  name: "GridItem"
})(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
})) as typeof Grid