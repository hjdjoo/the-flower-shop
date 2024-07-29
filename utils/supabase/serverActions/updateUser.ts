import { createClient } from "../server";

export async function updateUser(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId);

  console.log("updateUser/data, error", data, error)

  if (error) {
    return {
      data: null,
      error: error
    }
  }

  const profileData = data[0];
  const newMetadata = {
    "shop_acct_id": profileData.id
  }

  console.log(newMetadata)
  console.log("updating user...")
  const userResponse = await supabase.auth.updateUser({
    data: newMetadata
  })

  console.log("updateUser/userResponse: ", userResponse);

  return {
    data: "success",
    error: null
  }

}