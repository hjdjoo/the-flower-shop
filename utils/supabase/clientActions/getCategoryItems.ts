import { createClient } from "../client";
import { ProductData } from "@/app/types/db-types";

export const revalidate = 3600;

export const getCategoryItems = async (categoryId: number) => {

  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, prices, image_url")
    .contains("categories", [categoryId])
    .returns<ProductData[]>()

  return { data, error };

}