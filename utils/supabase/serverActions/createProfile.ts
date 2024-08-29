import { createClient } from "../serviceClient";

export async function createProfile(userId: string, isAdmin: boolean = false) {

  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      user_id: userId,
      is_admin: isAdmin
    })
    .select("id")
    .single();

  if (error) {
    console.error("createProfile/insert/error: ", error.message, error.details)
    return {
      data: null,
      error: error
    }
  };

  return {
    data: data,
    error: null
  }

}