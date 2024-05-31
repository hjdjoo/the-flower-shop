"use client"

import { useState, useEffect } from "react";

import { ProductData } from "@/app/types/db-types";


export default function CategoryPage(
  { params, }
    :
    {
      params:
      { name: string },
    }
) {


  useEffect(() => {

  }, [])

  const { name } = params;


  return (
    <>
      <h1>{name}</h1>
    </>
  )
}