import { payload } from "@/payload";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
    params,
  }: {
    params: Promise<{ product: string }>;
}): Promise<Metadata> {
    const { product: productParam } = await params
    const { docs: products } = await payload.find({
         collection: 'products', 
         where: { slug: { equals: productParam } 
        }})
    const indexable = true
    const [product] = products
    if (!product || typeof product.image === 'number') return notFound()

    const { width, height, url, alt } =  product.image
    return {
        title: product.title,
        description: product.description,
        robots: {
            index: indexable,
            follow: indexable,
            googleBot: {
              index: indexable,
              follow: indexable
            }
        },
        openGraph: {
            title: product.title,
            description: product.description,
            images: [
                {
                    url: url ?? "",
                    width: width ?? "1200",
                    height: height ?? "630",
                    alt: alt ?? "product image",
                },
            ],
        }
    }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return children;
}