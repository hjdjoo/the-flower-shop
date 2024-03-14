import AuthForm from '@/app/_components/AuthForm';

// OAuth has been configured but no particular functionality is associated with a user account.
// Admin functionality is being prioritized; this should allow admin access through OAuth credentials.

export default function SignIn() {
  // upon logging in, check if user exists in database.
  // if user exists in database, redirect to homepage.
  // if user is admin, redirect to admin dashboard.
  // otherwise, redirect to signup page. 

  return (
    <>
      <AuthForm />
    </>

  )
}