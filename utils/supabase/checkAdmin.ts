"use server"

import { createClient } from "./server";

export default async function checkAdmin(uuid: string | undefined): Promise<boolean> {

  if (!uuid) return false;

  const supabase = createClient();

  // console.log(uuid);

  const { data, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq('user_id', uuid)
    .limit(1)
    .single();

  // console.log('checkAdmin/data: ', data?.is_admin)
  // console.log('checkAdmin/typeof data: ', typeof data?.is_admin)
  return data?.is_admin

}