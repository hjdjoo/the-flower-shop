export default function GoogleButton() {

  return (
    <>
      <div id="g_id_onload"
        data-client_id={`${process.env.GOOGLE_CLIENT_ID}`}
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