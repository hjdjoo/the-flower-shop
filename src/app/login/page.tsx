"use client"

import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
// import { useTheme } from "@mui/material"
import GoogleIcon from '@mui/icons-material/Google';


export default function Login() {

  // const theme = useTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [formIsReady, setFormIsReady] = useState(false)

  // console.log(theme);
  return (

    <Container
      sx={{
        marginTop: "100px",
        border: "1px solid black",
        height: "500px",
        width: "70%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
      <Typography
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
        <Button
          variant="contained"
          color="secondary"
        >
          <GoogleIcon
            sx={{
              paddingRight: "10px"
            }}
          />
          Sign in with Google
        </Button>
      </Stack>
    </Container >

  )
}