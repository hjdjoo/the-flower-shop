import { cache } from "react";
import { createClient } from "../client";

export const getProductIds = cache(async () => {

  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("id")
    .returns<{ id: number }[]>()

  return { data, error }

})