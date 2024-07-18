
import { Suspense } from "react";

import { ProductData } from "@/app/types/client-types";
// import { ProductData as DbData } from "@/app/types/db-types";

import { getProductInfo } from "@/utils/supabase/clientActions/getProductInfo";

import ProductCard from "../_components/ProductCard";

export default async function ProductPage({ params }: { params: { productId: number } }) {

  const { productId } = params;

  const { data, error } = await getProductInfo(productId);

  if (!data || error) throw new Error("Couldn't get product info")

  const productInfo = data;

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <ProductCard productId={productId} productInfo={productInfo}
        />
      </Suspense>
    </>
  )
}