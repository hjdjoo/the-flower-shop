"use client"

import { styled } from "@mui/material/styles";

// custom product carousel components for natural swiping;
export const CarouselBox = styled("ul", {
  name: "Carousel",
  slot: "root"
})((theme) => ({
  // border: "1px solid black",
  height: "400px",
  listStyle: "none",
  overflowX: "scroll",
  whiteSpace: "nowrap",
  alignContent: "center",
  padding: "15px"
}))

export const CarouselItem = styled("li", {
  name: "Carousel",
  slot: "item"
})({
  // minWidth: "250px",
  // maxWidth: "300px",
  // minHeight: "250px",
  // maxHeight: "450px",
  marginTop: "0px",
  marginRight: "10px",
  marginLeft: "10px",
  marginBottom: "15px",
  display: "inline-block",
  // border: "1px dotted black",
  position: "relative"
})
