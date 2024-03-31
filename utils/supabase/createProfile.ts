import { createClient } from "./server";

export async function createProfile(userId: string, isAdmin: boolean = false) {

  const supabase = createClient();

  const { error } = await supabase
    .from("public.profiles")
    .insert({
      user_id: userId,
      is_Admin: isAdmin
    })

  if (error) {
    console.error(error)
  }
}