import { createClient } from "../client";
import { HomepageCategory } from "@/app/types/client-types";

export default async function getHomepageCategories() {

  const supabase = createClient();

  const { data, error } = await supabase
    .from("product_categories")
    .select("id, name")
    .in("name", ["Spring", "Summer", "Fall", "Winter", "Bestseller"])
    .eq("is_active", true)
    .returns<HomepageCategory[]>();

  return { data, error };

}