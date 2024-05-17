import { getProductIds } from "@/utils/supabase/clientActions/getProductIds"

export const generateStaticParams = async () => {
  const { data: productIds } = await getProductIds();

  console.log("products/layout.tsx/generateStaticParams/productIds: ", productIds)

  return productIds?.map(id => ({
    productId: id
  }))
}

export default function ProductLayout({ children, params }: { children: React.ReactNode, params: { productId: number } }) {

  return (
    <>
      {children}
    </>
  )
}