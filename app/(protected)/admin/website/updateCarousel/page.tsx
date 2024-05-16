"use client"

import Image from "next/image";

import { useEffect, useState, ChangeEvent } from "react";


import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import NewBannerImageForm from "../../_components/NewBannerImageForm";
import BackgroundBanner from "@/app/_components/BackgroundBanner";


export default function UpdateCarouselPage() {

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingX: "0px",
        marginTop: "20px"
      }}
    >
      <Box>
        <Typography>
          Banner Preview:
        </Typography>
        {/* <BackgroundBanner /> */}
      </Box>
      <NewBannerImageForm />
    </Container>
  )
}