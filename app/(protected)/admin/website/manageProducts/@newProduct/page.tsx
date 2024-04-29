"use client"

import { useState } from "react"

import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Collapse from "@mui/material/Collapse"
import NewProduct from "../../../_components/NewProductForm"

import { StyledContainer } from "@/app/_components/styled/StyledContainer"

export default function NewProductPage() {

  const [showNewProduct, setShowNewProduct] = useState<boolean>(false);

  return (

    <>
      <Button
        variant="outlined"
        onClick={() => { setShowNewProduct(!showNewProduct) }}
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
          Add New Product
        </Typography>
      </Button>
      <Collapse in={showNewProduct}>
        <NewProduct />
      </Collapse>
    </>
  )
}