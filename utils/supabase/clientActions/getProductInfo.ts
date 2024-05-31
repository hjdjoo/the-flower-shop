// import { cache } from "react";
import { createClient } from "../client";

import { ProductData } from "@/app/types/db-types";

export const getProductInfo = async (id: number) => {

  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .returns<ProductData[]>()

  // console.log('getProductIds/data: ', data);

  return { data, error }

}