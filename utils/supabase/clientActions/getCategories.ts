// import { cache } from "react";
import { createClient } from "../client";
import { CategoryData } from "@/app/types/db-types";

export const revalidate = 3600;

export const getCategories = async () => {

  const supabase = createClient();
  const { data, error } = await supabase
    .schema("public")
    .from("product_categories")
    .select("id, name, is_active")
    .returns<CategoryData[]>();

  return { data, error }

};