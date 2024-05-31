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
  height: "400px",
  listStyle: "none",
  overflowX: "scroll",
  whiteSpace: "nowrap",
  alignContent: "center",
  paddingLeft: "40px",
  // border: "1px solid blue",
  overflowY: 'hidden',
  '&::-webkit-scrollbar': {
    display: 'hidden',
  },
  sx: {

  }

}))

export const CarItem = styled("li", {
  name: "Carousel",
  slot: "item"
})((theme) => ({
  marginTop: "0px",
  marginRight: "15px",
  marginLeft: "15px",
  marginBottom: "15px",
  display: "inline-block",
  position: "relative",
  height: 375,
}))

export const CarButton = styled(IconButton, {
  name: "Carousel",
  slot: "button"
})({
  position: 'absolute',
  color: 'grey',
  borderRadius: 0,
  height: 400,
  zIndex: 1,
  '&:hover': {
    backgroundColor: 'transparent',
    color: 'black'
  }
})

export const CarPrevIcon = styled(ArrowBackIosOutlinedIcon, {
  name: "Carousel",
  slot: "backIcon"
})({
  position: 'relative',
  top: '150px'
})

export const CarNextIcon = styled(ArrowForwardIosOutlinedIcon, {
  name: "Carousel",
  slot: "nextIcon"
})({
  position: 'relative',
  top: '150px'
})