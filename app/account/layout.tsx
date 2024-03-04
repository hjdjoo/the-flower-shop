import Script from 'next/script';

export default function AccountLayout(
  { children, }:
    { children: React.ReactNode }
) {

  return (
    <section>
      <Script src="https://accounts.google.com/gsi/client" async></Script>
      {children}
    </section>
  )
}