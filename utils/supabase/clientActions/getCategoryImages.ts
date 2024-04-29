import { createClient } from "../client";
import { ProductData } from "@/app/types/client-types";

export default async function getCategoryImages(categoryId: number) {

  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("name, description, standard_price, premium_price, deluxe_price, image_url")
    .contains("categories", [categoryId])
    .returns<ProductData[]>()

  return { data, error };

}