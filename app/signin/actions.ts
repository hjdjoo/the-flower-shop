"use server"

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { createProfile } from "@/utils/supabase/createProfile";
import { NextResponse } from "next/server";

export async function login(formData: FormData) {

  const supabase = createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    throw new Error(process.env.NODE_ENV === "development" ? `signin/actions.ts/login/err: ${error}` : "Invalid credentials")
  };

  revalidatePath("/", "layout");
  redirect("/");

};

export async function signup(formData: FormData) {

  const supabase = createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  // console.log(data)

  const signUpResponse = await supabase.auth.signUp(data);

  console.log(signUpResponse.data);

  if (signUpResponse.error || !signUpResponse) {
    throw new Error(process.env.NODE_ENV === "development" ? `signin/actions.ts/signup/err: ${signUpResponse.error}` : "Invalid credentials")
  };

  const userId = signUpResponse.data.user?.id
  if (userId) {
    await createProfile(userId);
  }

  revalidatePath("/", "layout");
  redirect("/signin");

};