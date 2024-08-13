import { createClient } from "../server";

export async function createProfile(userId: string, isAdmin: boolean = false) {

  const supabase = createClient();


  const { error } = await supabase
    .from("profiles")
    .insert({
      user_id: userId,
      is_admin: isAdmin
    })

  if (error) {
    console.error("createProfile/insert/error: ", error.message, error.details)
    return {
      data: null,
      error: error
    }
  };

  return {
    data: "success",
    error: null
  }

}