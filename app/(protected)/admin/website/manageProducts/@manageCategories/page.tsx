"use client"

import { useState } from "react"

import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Collapse from "@mui/material/Collapse"
import Box from "@mui/material/Box"

import { StyledContainer } from "@/app/_components/styled/StyledContainer"
import ManageCategoriesForm from "../../../_components/ManageCategoriesForm"

export default function ManageCategoriesPage() {

  const [showManageCategories, setShowManageCategories] = useState<boolean>(false);

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => { setShowManageCategories(!showManageCategories) }}
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
          Manage Categories
        </Typography>
      </Button>
      <Collapse in={showManageCategories}>
        <ManageCategoriesForm />
      </Collapse>
    </>
  )
}