import { getCategories } from "@/utils/supabase/clientActions/getCategories";

export const generateStaticParams = async () => {

  const { data: categoryData } = await getCategories();

  return categoryData?.map(category => ({
    name: category.name
  }))

}

export default function CategoryLayout(
  {
    children,

  }: {
    children: React.ReactNode,

  }
) {

  return (
    <>
      {children}
    </>
  )
}