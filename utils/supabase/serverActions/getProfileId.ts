import { createClient } from "../serviceClient";

export async function getProfileId(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId);

  console.log("getProfileId/data, error", data, error);

  if (error) {
    return {
      data: null,
      error: error
    }
  }

  return {
    data: data[0],
    error: null
  }
}