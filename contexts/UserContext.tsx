"use client"

import { createContext, useContext, useState, useEffect } from "react";
import { User, UserContextType } from "@/app/types/auth-types";
import { createClient } from "@/utils/supabase/client";

interface UserProviderProps {
  children: React.ReactNode,
  currentUser: User,
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("No User Detected");
  }
  return context;
};

export const UserProvider: React.FC<UserProviderProps> = (
  {
    children, currentUser,
  }) => {
  const supabase = createClient();

  const [user, setUser] = useState<User>(currentUser);

  useEffect(() => {

    const fetchUser = async () => {

      const session = (await supabase.auth.getSession()).data.session;

      // console.log("UserContext/useEffect/fetchuser/session: ", session)

      if (session) {

        const shopId = session.user.user_metadata.shop_acct_id

        if (!shopId) {
          setUser({ role: "guest" });
        } else {

          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", shopId)
            .single();
          // console.log("UserContext/useEffect/profile: ", profile);
          if (profile.is_admin) {
            setUser({ role: "admin" });
          }
          else {
            setUser({ role: "user" })
          }
        }
      }
      else {
        setUser({ role: "guest" });
      }
    }

    fetchUser();

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUser();
      } else {
        setUser({ role: "guest" });
      }
    })


    return () => {
      authListener.unsubscribe();
    }
  }, [supabase])

  return (

    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>

  )
}