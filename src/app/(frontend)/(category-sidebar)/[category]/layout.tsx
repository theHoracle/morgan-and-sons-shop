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
        collection: 'category',
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

    const productExample = category.products?.slice(0,3)
                            .map((product) => (typeof product !== 'number') ? product.title : 'product' )
                            .join(', ')
    const catLen = category.products?.length || 0

    return {
        title: category.name,
        openGraph: {
            title: category.name,
            description: `Choose from our selection of ${category.name.toLowerCase()}, including ${productExample + (catLen > 1 ? "," : "")} and more. Fully ready to ship.`,
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