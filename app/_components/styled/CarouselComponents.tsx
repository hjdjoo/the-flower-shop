"use client"

import { styled } from "@mui/material/styles";

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
