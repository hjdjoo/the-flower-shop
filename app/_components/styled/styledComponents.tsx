"use client"

import { styled } from "@mui/material/styles";

import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

// use to center grid items into columns
export const GridItem = styled(Grid, {
  name: "GridItem"
})(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
})) as typeof Grid

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

// custom product carousel components for natural swiping;
export const CarouselBox = styled("ul")({
  height: "250px",
  border: "1px solid black",
  listStyle: "none",
  overflowX: "scroll",
  whiteSpace: "nowrap",
  alignContent: "center",
  padding: "15px"
})

export const CarouselItem = styled("li")({
  height: "220px",
  width: "170px",
  margin: "10px",
  display: "inline-block",
  border: "1px dotted black"
})

export const InputField = styled(TextField, {
  name: "InputField",
})(() => ({
  margin: "5px",

})) as typeof TextField
