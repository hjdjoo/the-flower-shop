// "use client"
import { useEffect, useState } from "react";
import Home from "./(home)/page"
import { signIn, useSession } from "next-auth/react";


export default function Main() {

  return (
    <>
      <Home></Home>

    </>
  )
}
