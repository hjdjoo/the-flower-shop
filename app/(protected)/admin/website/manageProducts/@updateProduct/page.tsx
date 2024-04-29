"use client"

import { useState } from "react"

import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Collapse from "@mui/material/Collapse"
import Box from "@mui/material/Box"
// import MainWrapper from "../../../_components/styled/MainWrapper"
import { StyledContainer } from "@/app/_components/styled/StyledContainer"

export default function UpdateProductPage() {

  const [showUpdateProduct, setShowUpdateProduct] = useState<boolean>(false);

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => { setShowUpdateProduct(!showUpdateProduct) }}
        fullWidth
        size="small"
        sx={{
          marginTop: "20px",
          marginBottom: "10px"
        }}
      >
        <Typography
          sx={{
            marginTop: "15px",
            marginBottom: "10px"
          }}
        >
          Update Product
        </Typography>
      </Button>
      <Collapse in={showUpdateProduct}>
        <Box
          component={"section"}
          sx={{
            width: "100%",
            height: "150px",
            border: "1px solid black"
          }}
        >
        </Box>
      </Collapse>
    </>
  )
}