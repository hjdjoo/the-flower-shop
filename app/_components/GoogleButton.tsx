import Container from "@mui/material/Container"
import { useEffect } from "react"
import Script from "next/script"

export default function GoogleButton() {

  // this hook is needed to re-inject the Google script when the button loads after renders -- re-rendering a page will not run the google script and the button will thus be blank upon re-rendering between pages.
  useEffect(() => {

    const script = document.createElement('script');

    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div id="g_id_onload"
        data-client_id={`${process.env.AUTH_GOOGLE_CLIENT_ID}`}
        data-context="signin"
        data-ux_mode="popup"
        data-login_uri="http://localhost:3000/"
        data-nonce=""
        data-itp_support="true">
      </div>
      <div className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left">
      </div>

    </>
  )
}