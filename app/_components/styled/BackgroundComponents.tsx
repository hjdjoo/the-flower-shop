import { styled } from "@mui/material";

import Image from "next/image";

import Container from "@mui/material/Container"

export const BackgroundContainer = styled(Container, {
  name: "BackgroundCarousel",
  slot: "root"
})({
  id: "background-container",
}) as typeof Container