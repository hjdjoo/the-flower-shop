import { styled } from "@mui/material";

import Image from "next/image";

// import { createTheme } from "@mui/material";
import { CssTransition } from "@mui/base/Transitions"
import ButtonBase from "@mui/material/Button";


export const BannerButton = styled(ButtonBase)((theme) => ({
  height: "10%",
  maxWidth: "60%",
  border: "1px solid white",
  color: "white",
  marginBottom: "15px",
  position: "absolute",
  textTransform: "none",
}))