"use client"

import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { useTheme } from "@mui/material/styles";

// custom product carousel components for natural swiping;
export const CarBox = styled("ul", {
  name: "Carousel",
  slot: "root",
})(({ theme }) => ({
  listStyle: "none",
  overflowX: "scroll",
  whiteSpace: "nowrap",
  alignContent: "center",
  paddingLeft: "30px",
  paddingRight: "30px",
  overflowY: 'hidden',
  '&::-webkit-scrollbar': {
    display: 'hidden',
  },
}))

export const CarItem = styled("li", {
  name: "Carousel",
  slot: "item"
})(({ theme }) => ({
  marginTop: "20px",
  marginRight: "5px",
  marginLeft: "5px",
  marginBottom: "5px",
  display: "inline-block",
  position: "relative",
}))

export const CarSpacer = styled(Box, {
  name: "Carousel",
  slot: "spacer"
})(({ theme }) => ({
  display: "flex",
  position: "absolute",
  height: "auto",
  alignItems: "flex-end",
  zIndex: 1,
  [theme.breakpoints.between("xs", "md")]: {
    width: "25px"
  },
  [theme.breakpoints.between("md", "lg")]: {
    width: "35px"
  },
  [theme.breakpoints.up("lg")]: {
    width: "45px"
  },
}))

export const CarButton = styled(IconButton, {
  name: "Carousel",
  slot: "button"
})(({ theme }) => ({
  position: 'absolute',
  color: 'grey',
  borderRadius: 100,
  height: "auto",
  zIndex: 2,
  backgroundColor: alpha("#FFFFFF", 0.7),
  '&:hover': {
    backgroundColor: "#e8e8e8",
    color: 'black'
  }
}))

export const CarPrevIcon = styled(ArrowBackIosOutlinedIcon, {
  name: "Carousel",
  slot: "backIcon"
})({
  position: 'relative',
})

export const CarNextIcon = styled(ArrowForwardIosOutlinedIcon, {
  name: "Carousel",
  slot: "nextIcon"
})({
  position: 'relative',
})