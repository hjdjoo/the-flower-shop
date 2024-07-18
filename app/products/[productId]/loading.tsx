"use client";

import { useEffect } from "react";

export default function Loading({ error, reset, }:
  {
    error: Error & { digest?: string }
    reset: () => void
  }) {

  useEffect(() => {
    console.error(error)
  }, [error]);

  return (
    <div>
      <h2>Loading page...</h2>
    </div>
  )

}