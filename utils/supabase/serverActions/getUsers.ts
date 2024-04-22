"use server"

import { createClient } from "@/utils/supabase/server";

async function getUsers() {

  const supabase = createClient();

  // const { data, error } = supabase
  //   .from("public.profiles")
  //   .select("")


}