import ProductPage from "@/components/products-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { payload } from "@/payload";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
    params: Promise<{ product: string }>;
}): Promise<Metadata> {
    const { product: productParam } = await props.params
    const { docs: products } = await payload.find({
         collection: 'products', 
         where: { slug: { equals: productParam } 
        }})
    
    const [product] = products
    if (!product) return notFound()

    return {
        openGraph: {
            title: product.title,
            description: product.description,
        }
    }
}

const ProductPageWrapper = async (props: {
    params: Promise<{
      product: string;
    }>;
  }) => {
    const { product: productParams } = await props.params
    const urlDecodedProduct = decodeURIComponent(productParams)

    const { docs: products } = await payload.find({
        collection: 'products',
        where: {
            slug: {
                equals: urlDecodedProduct
            }
        }
    })
    const [product] = products
    if (!product) return notFound();

    return (
        <div>
            <ProductPage product={product} />
        </div>
    )
}

export default ProductPageWrapper;