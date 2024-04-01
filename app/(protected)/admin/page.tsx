
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import checkAdmin from "@/utils/supabase/checkAdmin";
import { createClient } from "@/utils/supabase/server";

// necessary components:


// a dashboard that can control customer records, order records, order properties, delivery manager

export default function Admin() {

  // authorization should be done with a call to the database to check credentials.
  // server components makes sense.
  const cookieStore = cookies();

  const userRole = cookieStore.get("userRole")?.value;

  if (!userRole || userRole !== "admin") {
    redirect("/")
  }

  // console.log("Admin/page/authorized: ", authorized)

  return (
    <div>
      {userRole === "admin" &&
        <h1>Admin</h1>

      }
    </div>
  )
}