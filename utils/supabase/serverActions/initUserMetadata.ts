import { createClient } from "../serviceClient";
import { getProfileId } from "./getProfileId";
import { createProfile } from "./createProfile";

export async function initUserMetadata(userId: string) {
  const supabase = createClient();

  const metadata: { id?: number } = {};

  const { data: profileIdData, error } = await getProfileId(userId);
  // console.log("initUserMetadata/data, error", data, error)

  if (!profileIdData) {
    console.log('initUserMetadata/error log: ', error && error.message);
    console.log("no user found - initializing user account");
    const { data: createProfileData, error: createProfileError } = await createProfile(userId);

    if (createProfileError) {
      throw new Error(`Something wrong in the DB: ${createProfileError.message}`)
    }

    metadata.id = createProfileData.id;

  } else {

    metadata.id = profileIdData.id

  };

  console.log("updating user...")
  const userResponse = await supabase.auth.updateUser({
    data: {
      shop_acct_id: metadata.id
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