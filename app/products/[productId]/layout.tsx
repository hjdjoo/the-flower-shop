import { getProductInfo } from "@/utils/supabase/clientActions/getProductInfo"
import { Gutter } from "@/app/_components/Gutters"

export default function ProductCardLayout(
  { children, }:
    {
      children: React.ReactNode,
    }) {


  return (
    <>
      <Gutter
        className="gutter-spacer"
        sx={{
          alignSelf: "flex-start"
        }}
      />
      {children}
      <Gutter
        className="gutter-spacer"
        sx={{
          alignSelf: "flex-end"
        }}
      />
    </>
  )
}