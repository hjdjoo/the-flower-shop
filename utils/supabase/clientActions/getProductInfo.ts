// import { cache } from "react";
import { createClient } from "../client";

import { ProductData } from "@/app/types/db-types";

export const getProductInfo = async (id: number) => {

  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .returns<ProductData[]>()

  console.log('getProductIds/data: ', data);
  if (!data) {
    return {
      data: null,
      error: error
    }
  }

  const { id: productId, name, categories, description, prices, image_url } = data[0]

  const normalizedPrices = data[0].prices.map(price => {
    return price / 100
  })

  return {
    data: {
      productId: productId,
      name: name,
      categories: categories,
      description: description,
      prices: normalizedPrices,
      imageUrl: image_url
    }, error
  }

}