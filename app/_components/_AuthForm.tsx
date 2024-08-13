import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import { createClient } from '@/utils/supabase/client';
import { ChangeEvent, useState } from "react";

import { login, signup } from "../signin/actions"
import { InputField } from "./styled/InputField";

import Image from 'next/image'
import FavIcon from "../../assets/TheFlowerShop_Icons/TheFlowerShop512x512.ico"

import { Roboto } from "next/font/google";
import { Alert, FormControl } from "@mui/material";

import { AuthFormData } from "../types/component-types/AuthFormData";
import { ErrorMessage } from "../types/client-types";

const roboto = Roboto({
  subsets: ['latin'],
  weight: '700'
})

export default function AuthForm() {
  const supabase = createClient();
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: ""
  })

  const [LoginError, setLoginError] = useState<ErrorMessage>({
    severity: undefined,
    message: ""
  })

  const handleFormData = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    const { name, value } = e.currentTarget;

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleClick = async (isLogin: boolean) => {
    try {
      setLoginError({
        severity: undefined,
        message: ""
      });
      isLogin ? await login(formData) : await signup(formData);
    } catch (error) {
      setLoginError({
        severity: "error",
        message: `${error}`
      })
    }
  }

  const handleGoogleButton = async () => {

    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`
      }
    })
  }

  return (

    <FormControl
      sx={{
        p: 2,
        border: '1px solid grey.800',
        borderRadius: "15px",
        boxShadow: 4,
        display: "flex",
        flexDirection: "column",
        width: "500px",
        // height: "375px",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Image alt="Logo" src={FavIcon} width="128" height="128" style={{ paddingBottom: 25 }} />
      <InputField
        id="email"
        label="Email"
        name="email"
        onChange={handleFormData}
        value={formData.email}
        size="small"
        sx={{
          width: "80%"
        }}
      />
      <InputField
        id="password"
        label="Password"
        name="password"
        type="password"
        onChange={handleFormData}
        value={formData.password}
        size="small"
        sx={{
          width: "80%"
        }}
      />

      <Box
        sx={{
          p: 1,
          display: "flex",
          width: "80%",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={() => handleClick(true)}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            width: "48%",
            '&:hover': {
              backgroundColor: "#017307",
            }
          }}
        >
          Log in
        </Button>

        <Button onClick={() => handleClick(false)}
          sx={{
            border: "1px solid",
            borderColor: "primary.main",
            width: "48%",
          }}
        >
          Sign up
        </Button>
      </Box>

      {LoginError.severity && <Alert
        severity={LoginError.severity}
        sx={{
          marginY: "10px",
        }}
      >
        {LoginError.message}
      </Alert>}

      <div className={roboto.className}
        style={{ padding: 3 }}
      >
        <button className="gsi-material-button" onClick={handleGoogleButton}>
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper">
            <div className="gsi-material-button-icon">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="gsi-material-button-contents">Continue with Google</span>
          </div>
        </button>
      </div>

    </FormControl>
  )
}