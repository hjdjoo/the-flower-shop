"use client"

import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

export const InputField = styled(TextField, {
  name: "InputField",
})(() => ({
  margin: "5px",
})) as typeof TextField