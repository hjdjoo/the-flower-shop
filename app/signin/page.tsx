"use client"

import Head from 'next/head';
import AuthForm from '@/app/_components/_AuthForm';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@supabase/supabase-js';
import theme from '@/styles/theme';


// OAuth has been configured but no particular functionality is associated with a user account.
// Admin functionality is being prioritized; this should allow admin access through OAuth credentials.

export default function SignIn() {
  // upon logging in, check if user exists in database.

  // if user exists in database, redirect to homepage.

  // if user is admin, redirect to admin dashboard.

  // otherwise, redirect to signup page. 

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  return (
    <Container
      sx={{ marginTop: "200px" }}
    >
      <Auth
        supabaseClient={supabase}
        providers={["google"]}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#003d03",
              }
            }
          }
        }}
      />
      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Typography
          sx={{
            justifySelf: "center",
            fontSize: "0.85rem"
          }}>
          Sign In Provided by Supabase
        </Typography>
      </Stack>
    </Container>
  )
}