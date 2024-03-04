"use client"

import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import { useTheme } from "@mui/material"

import GoogleButton from "@/app/_components/GoogleButton"

export default function AuthForm() {

  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [formIsReady, setFormIsReady] = useState(false)

  // const handleSubmit = async () => {
  //   await fetch('/api/')

  // }

  return (
    <Container
      sx={{
        marginTop: "100px",
        border: "1px solid black",
        height: "500px",
        width: "80%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
      <Typography
        fontFamily={theme.typography.fontFamily}
        sx={{
          padding: "15px",
          margin: "25px 0px 15px",
          fontSize: "20px",
        }}
      >
        Login
      </Typography>
      <Stack
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "85%"
        }}>
        <TextField
          label="Email"
          onChange={(event) => {
            setFormData({ ...formData, email: event.target.value });
            setFormIsReady(formData.email && formData.password ? true : false);
          }}
          sx={{
            margin: "15px 0px",
            width: "100%",
          }}>
        </TextField>
        <TextField
          label="Password"
          onChange={(event) => {
            setFormData({ ...formData, password: event.target.value });
            setFormIsReady(formData.email && formData.password ? true : false);
          }}
          sx={{
            margin: "15px 0px 35px",
            width: "100%",
          }}>
        </TextField>
        <Button
          variant="contained"
          color="secondary"
          disabled={!formIsReady}
        >
          Log In
        </Button>
        <Typography
          sx={{
            margin: "25px 0px 25px"
          }}>
          Or
        </Typography>
      </Stack>
      <GoogleButton>
      </GoogleButton>
    </Container >

  )

}