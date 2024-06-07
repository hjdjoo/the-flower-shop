"use client"

import { styled } from "@mui/material/styles";
import IconButton from '@mui/material/IconButton';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { useTheme } from "@mui/material/styles";

// custom product carousel components for natural swiping;
export const CarBox = styled("ul", {
  name: "Carousel",
  slot: "root",
})((theme) => ({
  listStyle: "none",
  overflowX: "scroll",
  whiteSpace: "nowrap",
  alignContent: "center",
  paddingLeft: "5px",
  overflowY: 'hidden',
  '&::-webkit-scrollbar': {
    display: 'hidden',
  },
}))

export const CarItem = styled("li", {
  name: "Carousel",
  slot: "item"
})((theme) => ({
  marginTop: "20px",
  marginRight: "5px",
  marginLeft: "5px",
  marginBottom: "5px",
  display: "inline-block",
  position: "relative",
}))

export const CarButton = styled(IconButton, {
  name: "Carousel",
  slot: "button"
})({
  position: 'absolute',
  color: 'grey',
  borderRadius: 0,
  height: "auto",
  zIndex: 1,
  backgroundColor: "transparent",
  // '&:hover': {
  //   backgroundColor: 'transparent',
  //   color: 'black'
  // }
})

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