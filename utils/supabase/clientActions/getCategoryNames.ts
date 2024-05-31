import { createClient } from "../client";
import { cache } from "react";

export const revalidate = 3600;

export const getCategoryNames = async (categories: number[]) => {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_categories")
    .select("id, name")
    .in("id", categories)
    .returns<{ id: number, name: string }[]>()

  if (!data) {
    throw new Error("Nothing found in database.")
  }
  if (error) {
    throw new Error(`Error in db: ${error}`)
  }

  return { data };
}