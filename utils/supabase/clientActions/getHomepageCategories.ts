import { createClient } from "../client";
import { HomepageCategory } from "@/app/types/client-types";

export const revalidate = 3600;

export default async function getHomepageCategories() {

  const supabase = createClient();

  const { data, error } = await supabase
    .from("product_categories")
    .select("id, name")
    .in("name", ["Spring", "Summer", "Fall", "Winter", "Bestsellers", "Romantic"])
    .eq("is_active", true)
    .returns<HomepageCategory[]>();

  return { data, error };

}