"use client"

import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

// custom product carousel components for natural swiping;
export const CarouselBox = styled("ul", {
  name: "Carousel",
  slot: "root"
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
}))

export const CarouselItem = styled("li", {
  name: "Carousel",
  slot: "item"
})({
  marginTop: "0px",
  marginRight: "15px",
  marginLeft: "15px",
  marginBottom: "15px",
  display: "inline-block",
  position: "relative",
  height: 375,
})