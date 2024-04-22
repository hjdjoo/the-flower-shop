import { createClient } from "../client";
import { ProductForm } from "@/app/types/client-types";

export default async function addProduct(productData: ProductForm) {

  const supabase = createClient();

  const { name, description, prices, imageUrl, categories } = productData

  const { data, error } = await supabase
    .from("products")
    .insert({

    })

}