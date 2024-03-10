"use client"

import React, { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent, MouseEvent } from "react";

//MUI Imports:
import { useTheme } from "@mui/material";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import { hashPassword } from "@/utils/bcrypt";


//Other Components
import Link from "next/link";
import GoogleButton from "@/app/_components/GoogleButton";

import validator from "validator";
import { signIn } from "next-auth/react";

// Auth form is a reactive component; clicking "sign up" will not navigate away, rather re-render the form with appropriate inputs.
export default function AuthForm() {

  const theme = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(true)

  useEffect(() => {
    setFormSubmitted(false);
  }, [])

  // utility functions
  const toggleSignUp = () => {
    setFormSubmitted(false);
    setIsSignUp(true);
  };
  const checkPassword = (): boolean => {
    // check that the password has a minimum length and is reasonably secure.
    const validPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{6,}$/;

    return formData.password.match(validPassword) ? true : false;
  };
  const checkMatch = (): boolean => {
    return formData.password === passwordConfirm;
  };
  const emailHelperText = (): string | null => {
    if (!formData.email) return null;
    if (!validator.isEmail(formData.email)) return "Please enter a valid email"
    else return null;
  };
  const passwordHelperText = (): string | null => {
    if (!formData.password || !isSignUp) return null;
    else if (checkPassword()) return null
    else return "Password must be at least 8 characters and contain at least 1 uppercase, lowercase, special character, and number."
  };
  const passConfirmHelperText = (): string | null => {
    if (!passwordConfirm) return null;
    if (checkMatch()) return null;
    else return "Passwords do not match!"
  };
  const handleClickShowPassword = (event: MouseEvent<HTMLButtonElement>) => {
    console.log(event.currentTarget);
    if (event.currentTarget.id === "show-password") {
      setShowPassword((show) => !show)
    }
    if (event.currentTarget.id === "show-password-confirm") {
      setShowPasswordConfirm((show) => !show)
    }
  }
  const formReady = (): boolean | undefined => {
    switch (isSignUp) {
      case false:
        if (formData.email && formData.password) return true;
        else return false;
      case true:
        if (formData.email && formData.password) {
          if (checkPassword() && checkMatch()) return true
        }
        else return false;
    };
  };
  const handleFormData = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value })

  }

  // handle submission logic:
  const handleSubmit = async (e: FormEvent<HTMLElement>) => {

    e.preventDefault();

    const { email, password } = formData
    const credentials = {
      email: email,
      password: password
    }

    switch (isSignUp) {
      case false:
        // if it's not a signup form, then send a fetch request to /auth/ and check for the user/password match in the database.
        const signInRes = await signIn("credentials", { ...credentials, redirect: false })

        console.log('Authform/handleSubmit/login/credentials: ', credentials)
        console.log('Authform/handleSubmit/login/signInRes: ', signInRes);

        setFormSubmitted(true);
        console.log('form Submitted? ', formSubmitted)

        if (!signInRes?.ok) {
          setLoginSuccess(false);
        }
        else {
          setLoginSuccess(true);
        }
        setFormData({ email: "", password: "" })
        break;
      // if there is a match, then we set the userID and role in cookies and redirect back to home.


      case true:
        // and if it is a signup form, then send a fetch request to /auth/ and create a new user in the database with email and password.

        const signUpRes = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/createUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credentials })
        })

        setFormData({ email: "", password: "" })
        setPasswordConfirm("");
        console.log('AuthForm/handleSubmit/signUpRes.status: ', signUpRes.status)

      // Upon a successful addition to DB, the user is logged in, userID and role are set in cookies, and redirected back home.


    };

  };

  return (
    <Container
      id="auth-form-container"
      sx={{
        border: "1px solid darkgrey", marginTop: "100px", paddingBottom: "35px", width: "80%", display: "flex", flexDirection: "column", alignItems: "center"
      }}>
      <Typography
        id="form-title"
        fontFamily={theme.typography.fontFamily}
        sx={{
          padding: "15px", margin: "25px 0px 5px", fontSize: "20px",
        }}
      >
        {isSignUp ? "Sign Up" : "Log In"}
      </Typography>
      <form id="auth-form" onSubmit={(e) => { handleSubmit(e) }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "85%" }}>
        <TextField
          id="email-input"
          label="Email"
          name="email"
          onChange={handleFormData}
          value={formData.email}
          required
          error={!formData.email ? false : !validator.isEmail(formData.email)}
          helperText={emailHelperText()}
          sx={{
            margin: "15px 0px", width: "100%",
          }}>
        </TextField>
        <TextField
          id="password-input"
          label="Password"
          name="password"
          required
          type={showPassword ? "text" : "password"}
          value={formData.password}
          // error will not trigger on Login page.
          error={!isSignUp ? false : (!formData.password ? false : !checkPassword())}
          helperText={passwordHelperText()}
          onChange={handleFormData}
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  id="show-password"
                  onClick={handleClickShowPassword}
                  edge="end"
                  tabIndex={-1}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
          }}
          sx={{
            margin: "15px 0px 15px", width: "100%",
          }}>
        </TextField>
        {isSignUp &&
          <TextField
            id="password-confirm-input"
            label="Confirm Password"
            type={showPasswordConfirm ? "text" : "password"}
            error={!passwordConfirm ? false : !checkMatch()}
            required
            helperText={passConfirmHelperText()}

            onChange={(event) => {
              setPasswordConfirm(event.target.value)
            }}
            value={passwordConfirm}
            InputProps={{
              endAdornment:
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    id="show-password-confirm"
                    onClick={handleClickShowPassword}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
            }}
            sx={{
              margin: "15px 0px 35px", width: "100%",
            }}>
          </TextField>}
        {!isSignUp &&
          <>
            <Button
              id="login-button"
              form="auth-form"
              variant="contained"
              color="secondary"
              disabled={!formReady()}
              type="submit"
              sx={{ marginBottom: "10px" }}
            >
              Log In
            </Button>
            <Typography
            >
              No account yet?
            </Typography>
          </>}
        <Button
          id="signup-button"
          form="auth-form"
          variant="contained"
          color="secondary"
          disabled={!isSignUp ? false : !formReady()}
          onClick={() => { if (!isSignUp) toggleSignUp() }}
          type="submit"
          sx={{
            marginTop: "10px"
          }}
        >
          Sign Up
        </Button>
        <Typography
          sx={{
            margin: "10px 0px 10px"
          }}>
          Or
        </Typography>
        <GoogleButton />
        {isSignUp &&
          <>
            <Typography
              sx={{ marginTop: "20px" }}
            >
              Have an account already?
            </Typography>
            <Button
              id="back-to-login"
              onClick={() => setIsSignUp(false)}>
              Log in
            </Button>
          </>}
      </form>
      {formSubmitted && <Alert
        variant="outlined"
        severity={loginSuccess ? "success" : "error"}
        sx={{
          marginTop: "15px"
        }}
      >
        {loginSuccess ? "Success! Redirecting..." : "Invalid Credentials"}
      </Alert>}
    </Container >
  )

}