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

    /**
     * 
     * @returns void;
     * This function gets the profile and all the recipients related to that user, and stores it as a part of the user's profile (state).
     */
    const fetchUser = async () => {

      const session = (await supabase.auth.getSession()).data.session;

      // console.log("UserContext/useEffect/fetchuser/session: ", session)

      if (session) {

        const shopId = session.user.user_metadata.shop_acct_id

        if (!shopId) {
          setUser({ role: "guest" });
        } else {

          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*, recipients(*)")
            .eq("id", shopId)
            .single();

          if (error) {
            console.error(error.details);
            setUser({ role: "guest" });
            return;
          }
          // console.log("UserContext/useEffect/profileData: ", profileData);

          const recipients = profileData.recipients.map(recip => {
            return {
              id: recip.id,
              firstName: recip.first_name || "",
              lastName: recip.last_name || "",
              street1: recip.street_address_1 || "",
              street2: recip.street_address_2 || "",
              townCity: recip.town_city || "",
              state: recip.state || "",
              zip: recip.zip || "",
              phone: recip.phone || "",
            }
          })

          if (profileData.is_admin) {
            setUser({ id: profileData.id, role: "admin", recipients: recipients.length ? recipients : [] });
          }
          else {
            setUser({ id: profileData.id, role: "user", recipients: recipients.length ? recipients : [] })
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