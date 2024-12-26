import { ProductCard } from "@/components/product-card"
import { payload } from "@/payload"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
    const { docs: categories } = await payload.find({
        collection: 'categories',
        depth: 0,
        select: { slug: true }
    })
    if(categories.length === 0) {
        return []
    }
    return categories.map((category) => ({
        slug: category.slug
    }))
}

const CategoryPage = async ({ params }: {params: Promise<{category: string}>}) => {
    const { category } = await params
    if(!category) {
        return notFound()
    }
    const { docs: categories } = await payload.find({
        collection: 'categories',
        where: { slug: { equals: category }},
        depth: 0,
    })
    if(categories.length === 0) {
        return notFound()
    }
    const  { docs: products } = await payload.find({
        collection: 'products',
        where: { category: { equals: categories[0].id } },
        depth: 1,
    })
    // products amount
    const amount = products?.length || 0

    return (
        <div>
            <h1
            className="flex items-end justify-between w-full text-2xl font-semibold tracking-tighter leading-tight"
            >{categories[0].name}
            <p className='text-xs font-light tracking-normal lowercase'>{amount} {amount === 1 ? 'Product' : 'Products'}</p>
            </h1>
            <hr className='mt-1 w-full stroke-neutral-700' />
           
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 py-1'>
            {products?.filter(product => typeof product !== 'number').map((product) => (
                    <ProductCard 
                        product={product} 
                        key={product.id} />
            ))}
            </div>
            
        </div>
    )
}

export default CategoryPage;