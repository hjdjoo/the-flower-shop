import { getProductInfo } from "@/utils/supabase/clientActions/getProductInfo"


export default function ProductLayout(
  { children, }:
    {
      children: React.ReactNode,
    }) {


  return (
    <>
      {children}
    </>
  )
}