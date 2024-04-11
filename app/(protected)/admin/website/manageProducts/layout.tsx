
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
      {children}
      {updateProduct}
      {newProduct}
      {manageCategories}
    </>
  )
}