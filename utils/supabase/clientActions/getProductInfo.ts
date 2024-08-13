// import { cache } from "react";
import { createClient } from "../client";

import { ProductData } from "@/app/types/db-types";

export const getProductInfo = async (id: number) => {

  const supabase = createClient();

  const { data: dbData, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .returns<ProductData[]>()

  if (!dbData || !dbData[0]) {
    console.error("getProductInfo", error);
    return { dbData, error }
  }
  // console.log('getProductIds/data: ', data);
  const { id: productId, name, description, categories, prices, image_url, } = dbData[0];

  // console.log(prices);
  const normalizedPrices = prices.map(price => {
    return price / 100;
  })

  return {
    data: {
      id: productId,
      name: name,
      description: description,
      categories: categories,
      prices: normalizedPrices,
      imageUrl: image_url
    },
    error: error
  }

  // return { data, error }

}