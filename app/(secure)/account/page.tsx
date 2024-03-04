"use client"

import { useState, useEffect } from "react";
import Login from "./login/page";

export default function Account() {


  return (
    <div>
      <script src="https://accounts.google.com/gsi/client" async></script>
      <Login></Login>
    </div>
  )
}