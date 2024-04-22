import { createClient } from "../client";
import { CategoryData } from "@/app/types/db-types";

export default async function getCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .schema("public")
    .from("product_categories")
    .select("id, name, is_active")
    .returns<CategoryData[]>();

  return { data, error }
}