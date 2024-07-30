import { createClient } from "../client";
import { ProductData } from "@/app/types/client-types";

export default async function addProduct(productData: ProductData) {

  const supabase = createClient();

  const { name, description, prices, imageUrl, categories } = productData

  // console.log('addProduct: ', productData);

  const centPrices = prices.map(price => price * 100);

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: name,
      description: description,
      prices: centPrices,
      categories: categories,
      image_url: imageUrl
    })
    .select();

  return { data, error };

}