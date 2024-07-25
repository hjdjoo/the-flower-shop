export default function CheckoutLayout({ children, payment }: { children: React.ReactNode, payment: React.ReactNode }) {


  return (
    <>
      {children}
      {payment}
    </>
  )
}