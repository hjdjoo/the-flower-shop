// import { cache } from "react";
import { createClient } from "../client";

// import { ProductData } from "@/app/types/db-types";

/**
 * 
 * @param productIds : number | number[]; A productId or an array of productIds. 
 * @returns :ProductData[]; when fetching data for a single product, access with data[0]
 */
export const getProductInfo = async (productIds: number | number[]) => {

  let ids: number[];

  if (typeof productIds === "number") {
    ids = [productIds];
  } else {
    ids = productIds;
  }

  const supabase = createClient();

  const { data: dbData, error } = await supabase
    .from("products")
    .select("*")
    .in("id", ids)

  if (!dbData || !dbData[0]) {
    console.error("getProductInfo", error);
    return { data: null, error: error }
  }
  // console.log('getProductIds/data: ', data);

  return {
    data: dbData.map(item => {

      const { id: productId, name, description, categories, prices, image_url, } = item;

      const normalizedPrices = prices.map(price => {
        return price / 100;
      })

      return {
        id: productId!,
        name: name!,
        description: description ? description : "",
        categories: categories!,
        prices: normalizedPrices!,
        imageUrl: image_url!
      }

    }),
    error: error
  }

}