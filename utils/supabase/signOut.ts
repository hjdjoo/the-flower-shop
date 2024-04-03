import { createClient } from "./client";

export default function signOut() {
  const supabase = createClient();

  supabase.auth.signOut();


}