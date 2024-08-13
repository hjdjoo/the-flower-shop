import { createClient } from "../serviceClient";
import { getProfileId } from "./getProfileId";

export async function initUserMetadata(userId: string) {
  const supabase = createClient();

  const { data, error } = await getProfileId(userId);
  // console.log("initUserMetadata/data, error", data, error)

  if (error) {
    return {
      data: null,
      error: error
    }
  }

  console.log("updating user...")
  const userResponse = await supabase.auth.updateUser({
    data: {
      shop_acct_id: data.id
    }
  })

  // console.log("initUserMetadata/userResponse: ", userResponse);
  if (userResponse.error) {
    console.error(userResponse.error);
    console.error(userResponse.error.message);
    return {
      data: null,
      error: userResponse.error
    }
  }

  return {
    data: `success: ${userResponse.data}`,
    error: null
  }

}