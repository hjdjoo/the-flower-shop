import { createClient } from "../client";
import { ProductData } from "@/app/types/client-types";

export default async function addProduct(productData: ProductData) {

  const supabase = createClient();

  const { name, description, standardPrice, premiumPrice, deluxePrice, imageUrl, categories } = productData

  console.log('addProduct: ', productData);

  const standard_price = parseFloat(standardPrice) * 100
  const premium_price = parseFloat(premiumPrice) * 100
  const deluxe_price = parseFloat(deluxePrice) * 100

  const prices = [standard_price, premium_price, deluxe_price]

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: name,
      description: description,
      prices: prices,
      categories: categories,
      image_url: imageUrl
    })
    .select();

  return { data, error };

}