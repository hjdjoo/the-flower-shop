"use client";

import { useEffect } from "react";

export default function Loading({ error, reset, }:
  {
    error: Error & { digest?: string }
    reset: () => void
  }) {

  useEffect(() => {
    if (!error) return;
    console.error("products/Loading.tsx/useEffect/error: ", error)
  }, [error]);

  return (
    <div>
      <h1>Loading page...</h1>
    </div>
  )

}