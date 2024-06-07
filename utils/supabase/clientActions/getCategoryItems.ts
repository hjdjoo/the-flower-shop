import { cache } from "react";
import { createClient } from "../client";
import { ProductData } from "@/app/types/db-types";

export const revalidate = 3600;

export const getCategoryItems = async (categoryId: number) => {

  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, standard_price, premium_price, deluxe_price, image_url")
    .contains("categories", [categoryId])
    .returns<ProductData[]>()

  return { data, error };

}