"use client"
import { styled } from "@mui/material/styles";

export const StyledImageList = styled("ul")({
  height: "250px",
  border: "1px solid black",
  listStyle: "none",
  overflowX: "scroll",
  whiteSpace: "nowrap",
  alignContent: "center",
  padding: "15px"
})

export const StyledListItem = styled("li")({
  height: "220px",
  width: "170px",
  margin: "10px",
  display: "inline-block",
  border: "1px dotted black"
})