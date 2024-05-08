"use server"

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { createProfile } from "@/utils/supabase/serverActions/createProfile";
import { NextResponse } from "next/server";
import { AuthFormData } from "../_components/types/AuthFormData";

export async function login(formData: AuthFormData) {
  const supabase = createClient();
  const data = {
    email: formData.email as string,
    password: formData.password as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data);
  // console.log("Error Log:", error);
  // console.log("error status", error?.status);
  // console.log("error message", error?.message);
  // console.log("error name", error?.name);
  if (error) {
    throw new Error(error?.message);
    // throw new Error(process.env.NODE_ENV === "development" ? `signin/actions.ts/login/err: ${error}` : "Invalid credentials")
  };

  revalidatePath("/", "layout");
  redirect("/");

};

export async function signup(formData: AuthFormData) {

  const supabase = createClient();
  const data = {
    email: formData.email as string,
    password: formData.password as string,
  }

  // console.log(data)

  const signUpResponse = await supabase.auth.signUp(data);

  console.log(signUpResponse.data);

  if (signUpResponse.error) {
    throw new Error(signUpResponse.error?.message);
    // throw new Error(process.env.NODE_ENV === "development" ? `signin/actions.ts/signup/err: ${signUpResponse.error}` : "Invalid credentials")
  } else if (!signUpResponse) {
    throw new Error("No reponse from Supabase");
  };

  const userId = signUpResponse.data.user?.id
  if (userId) {
    await createProfile(userId);
  }

  revalidatePath("/", "layout");
  redirect("/signin");

};