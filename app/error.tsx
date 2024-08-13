"use client";

import { useEffect } from "react";

export default function Error({ error, reset, }:
  {
    error: Error & { digest?: string }
    reset: () => void
  }) {

  useEffect(() => {
    if (!error) return;
    else {
      console.error(error)
    }
  }, [error]);

  return (
    <div>
      <h1>Something went wrong!</h1>
    </div>
  )

}