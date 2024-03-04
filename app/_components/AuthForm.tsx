"use client"

import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import { useTheme } from "@mui/material"
import Link from "next/link"

import GoogleButton from "@/app/_components/GoogleButton"

interface AuthFormProps {
  isSignUp?: boolean
}

export default function AuthForm({ isSignUp }: AuthFormProps) {

  useEffect(() => {
    renderGoogleButton();
  }, [isSignUp])

  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [formIsReady, setFormIsReady] = useState(false)

  const renderGoogleButton = () => {
    return (
      <GoogleButton></GoogleButton>
    )
  }

  const SignInGoogle = renderGoogleButton();
  // const handleSubmit = async () => {
  //   await fetch('/api/')

  // }

  return (
    <Container
      sx={{
        marginTop: "100px",
        border: "1px solid black",
        height: "600px",
        width: "80%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
      <Typography
        fontFamily={theme.typography.fontFamily}
        sx={{
          padding: "15px",
          margin: "25px 0px 5px",
          fontSize: "20px",
        }}
      >
        {isSignUp ? "Sign Up" : "Log In"}
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
          id="password-input"
          label="Password"
          hidden={!isSignUp}
          onChange={(event) => {
            setFormData({ ...formData, password: event.target.value });
          }}
          sx={{
            margin: "15px 0px 15px",
            width: "100%",
          }}>
        </TextField>
        <TextField
          id="password-confirm"
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
          hidden={isSignUp}
          sx={{ marginBottom: "10px" }}
        >
          Log In
        </Button>
        <Typography
        >
          No account yet?
        </Typography>
      </Stack>
      <Stack
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button
          id="sign-up-button"
          variant="contained"
          color="secondary"
          sx={{
            marginTop: "10px"
          }}
        >
          <Link href="/account/signup">
            Sign Up
          </Link>
        </Button>
        <Typography
          sx={{
            margin: "10px 0px 10px"
          }}>
          Or
        </Typography>
        {SignInGoogle}
      </Stack>
    </Container >
  )

}