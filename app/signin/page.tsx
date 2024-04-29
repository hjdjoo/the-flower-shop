"use client"

import { useEffect } from 'react';

// import Head from 'next/head';
import { useRouter } from 'next/navigation';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from '@supabase/auth-ui-shared';

import Button from '@mui/material/Button';

import AuthForm from '@/app/_components/_AuthFormSimple';

import { createClient } from '@/utils/supabase/client';
// import { createClient } from '@supabase/supabase-js';
import theme from '@/styles/theme';


// OAuth has been configured but no particular functionality is associated with a user account.
// Admin functionality is being prioritized; this should allow admin access through OAuth credentials.

export default function SignIn() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        console.log(session);
        router.push('/')
      }
    })

    return () => {
      authListener.subscription.unsubscribe();
    }

  }, [router, supabase.auth])

  return (
    <Container
      sx={{
        marginTop: "200px",
      }}
    >
      <AuthForm>

      </AuthForm>

      {/* <Auth
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
      /> */}
      <Button
        sx={{
          border: "1px solid black",
          height: "20px"
        }}
        onClick={() => supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`
          }
        })}>
        Sign in with Google
      </Button>


      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        {/* <Typography
          sx={{
            justifySelf: "center",
            fontSize: "0.85rem"
          }}>
          Sign In Provided by Supabase
        </Typography> */}
      </Stack>
    </Container>
  )
}