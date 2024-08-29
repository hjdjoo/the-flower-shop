import { createClient } from "../client";

import { User } from "@/app/types/auth-types";

export default async function initCart(user: User) {

  const supabase = createClient();

  if (!user || !user.id) {
    console.log("no user detected. LocalStorage should be used.");
    return {
      data: null,
      error: new Error("No user detected. No access to carts")
    }
  };

  // return {
  //   data: "initCart called",
  //   error: null
  // }

  const { data: cartInitData, error: cartInitError } = await supabase
    .from("carts")
    .upsert({ sender_id: user.id })
    .select("id")
    .single();

  console.log("initCart/cartInitData, cartInitError: ", cartInitData, cartInitError)
  return {
    data: cartInitData,
    error: cartInitError
  }

}