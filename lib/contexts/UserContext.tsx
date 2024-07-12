"use client"

import { createContext, useContext, useState, useEffect } from "react";
import { UserState, UserContextType } from "../lib-types/authTypes";
import { createClient } from "@/utils/supabase/client";

interface UserProviderProps {
  children: React.ReactNode,
  currentUser: UserState,
}

const UserContext = createContext<UserContextType | undefined>(undefined);

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

  const [user, setUser] = useState<UserState | undefined>(currentUser);

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {

      const session = (await supabase.auth.getSession()).data.session;

      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (profile.is_admin) {
          setUser({ role: "admin" });
        }
        else {
          setUser({ role: "user" })
        }

      }
      else {
        setUser(undefined);
      }
    }

    fetchUser();

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUser();
      } else {
        setUser(undefined);
      }
    })


    return () => {
      authListener.unsubscribe();
    }
  }, [])

  return (

    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>

  )
}