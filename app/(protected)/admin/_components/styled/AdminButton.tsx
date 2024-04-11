"use client"

import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";


export const AdminButton = styled(Button, {
  name: "AdminButton",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.primary.main,
  color: "white",
  padding: "5%",
  justifyContent: "space-around",
  width: "100%",
  height: "100%",
  // ":focus": ,
  // border: "1px solid black",
  font: theme.typography.fontFamily,
  "&:hover": {
    backgroundColor: theme.palette.primary.light
  }
})) as typeof Button
