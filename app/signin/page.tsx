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

import AuthForm from '@/app/_components/_AuthForm';

import { createClient } from '@/utils/supabase/client';
// import { createClient } from '@supabase/supabase-js';
import theme from '@/styles/theme';


export default function SignIn() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        console.log("SignIn/session: ", session);
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
        marginTop: "150px",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <AuthForm />
    </Container>
  )
}