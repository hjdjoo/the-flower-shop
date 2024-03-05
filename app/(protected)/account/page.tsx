"use client"

import { useState, useEffect, createContext } from "react";
import SignIn from "./signin/page";
import AuthForm from "@/app/_components/AuthForm";



export default function Account() {



  return (
    <div>
      {/* TODO: Add logic to route users to a LogIn page if not logged in, send to Account page if logged in. For now, no account page; logging in should be available for protected functions like checking out for MVP. */}

      <SignIn />

    </div>
  )
}