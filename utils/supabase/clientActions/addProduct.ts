import { createClient } from "../client";
import { ProductForm } from "@/app/types/client-types";

export default async function addProduct(productData: ProductForm) {

  const supabase = createClient();

  const { name, description, standardPrice, premiumPrice, deluxePrice, imageUrl, categories } = productData

  console.log('addProduct: ', productData);

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: name,
      description: description,
      standard_price: standardPrice,
      premium_price: premiumPrice,
      deluxe_price: deluxePrice,
      categories: categories,
      image_url: imageUrl
    })
    .select();

  return { data, error };

}