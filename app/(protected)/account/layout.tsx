import Script from 'next/script';
import GoogleButton from '@/app/_components/GoogleButton';
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

export default function AccountLayout(
  { children, }:
    { children: React.ReactNode }
) {

  return (
    <section>
      <Script src="https://accounts.google.com/gsi/client" async></Script>

      {children}
      <GoogleButton />

    </section>
  )
}