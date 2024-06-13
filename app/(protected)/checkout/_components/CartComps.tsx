"use client"

import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";

export const CartDateDiv = styled("div", {
  name: "Cart",
  slot: "DateDiv"
})((theme) => ({
  // display: "flex",
  // alignContent: "center",
  // justifyContent: "center",
  // justifyItems: "center",
  // alignItems: "center",
  border: "solid red 1px"
}))