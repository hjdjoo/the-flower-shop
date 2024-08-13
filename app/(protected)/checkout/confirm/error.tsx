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
      console.error("checkout/confirm/error/error: ", error)
      console.error("checkout/confirm/error/error.digest: ", error.digest)
    }
  }, [error]);

  return (
    <div>
      <h1>Something went wrong!</h1>
    </div>
  )

}