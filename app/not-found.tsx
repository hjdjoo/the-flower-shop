"use client";

import { useEffect } from "react";

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

export default function Error({ error, reset, }:
  {
    error: Error & { digest?: string }
    reset: () => void
  }) {

  useEffect(() => {

    console.error(error)
  }, [error]);

  return (
    <Box id="not-found-page"
      sx={{
        width: "90%",
        height: "500px",
        marginTop: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Typography>Page not found!</Typography>
    </Box>
  )

}