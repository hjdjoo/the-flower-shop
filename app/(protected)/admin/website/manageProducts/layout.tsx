"use client"

import { StyledContainer } from "@/app/_components/styled/StyledContainer"

export default function ManageProductsLayout({
  children,
  updateProduct,
  newProduct,
  manageCategories,
}: {
  children: React.ReactNode,
  updateProduct: React.ReactNode
  newProduct: React.ReactNode
  manageCategories: React.ReactNode
}) {

  return (
    <>
      <StyledContainer>
        {children}
        {updateProduct}
        {newProduct}
        {manageCategories}
      </StyledContainer>
    </>
  )
}