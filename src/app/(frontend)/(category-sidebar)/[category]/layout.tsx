import { payload } from "@/payload";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
    params,
  }: {
    params: Promise<{ category: string }>;
  }): Promise<Metadata> {

    const { category: categoryParams } = await params
    const urlDecoded = decodeURIComponent(categoryParams)
    const { docs: categories } = await payload.find({
        collection: 'categories',
        where: {
            slug: {
                equals: urlDecoded
            }
        }
    })
    const [category] = categories
    if(!category) {
         return notFound()
    }

    const productExample = category.products?.docs?.slice(0,3)
                            .map((product) => (typeof product !== 'number') ? product.title : 'product' )
                            .join(', ')
    const catLen = category.products?.docs?.length || 0
    const desc = `Choose from our selection of ${category.name.toLowerCase()}, including ${productExample + (catLen > 1 ? "," : "")} and more. Fully ready to ship.`
    return {
        title: category.name,
        description: desc,
        openGraph: {
            title: category.name,
            description: desc,
        },
    }
}

export default function Layout ({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return children
}