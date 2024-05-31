// import Container from "@mui/material/Container"
// import { useEffect, useState } from "react"
// import Script from "next/script"
// import { generateNonce } from "@/utils/actions/generateNonce";
// import { NextResponse } from "next/server";
// import { createClient } from "@/utils/supabase/client";

// export default function GoogleButton() {

//   // this hook is needed to re-inject the Google script when the button loads after renders -- re-rendering a page will not run the google script and the button will thus be blank upon re-rendering between pages.
//   const [nonce, setNonce] = useState('');

//   useEffect(() => {

//     const script = document.createElement('script');

//     script.src = 'https://accounts.google.com/gsi/client';
//     script.async = true;
//     script.defer = true;

//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   async function handleSignInWithGoogle(response: any) {
//     console.log('GoogleButton/response: ', response);

//     const supabase = createClient();

//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: 'google',
//     })

//     console.log('GoogleButton/data: ', data)

//   }


//   return (
//     <>
//       <div
//         id="g_id_onload"
//         data-client_id={`${process.env.AUTH_GOOGLE_CLIENT_ID}`}
//         data-context="signin"
//         data-ux_mode="popup"
//         data-callback={handleSignInWithGoogle}
//         data-nonce={nonce}
//         data-auto_select="true"
//         data-itp_support="true"
//       ></div>

//       <div
//         className="g_id_signin"
//         data-type="standard"
//         data-shape="pill"
//         data-theme="outline"
//         data-text="signin_with"
//         data-size="large"
//         data-logo_alignment="left"
//       ></div>

//     </>
//   )
// }