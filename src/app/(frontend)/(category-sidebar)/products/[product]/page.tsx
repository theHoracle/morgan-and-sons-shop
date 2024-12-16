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

const ProductPage = async (props: {
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
            <h1>Product {product.title}</h1>
            <p>Product page</p>
            <div>
                <Card
                className="flex flex-col md:flex-row gap-4 "
                >
                    <div>
                        {/* image component */}
                    </div>
                    <div>
                        <h2>{product.title}</h2>
                        <p>{product.description}</p>
                    </div>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                        
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ProductPage;