import { ProductCard } from "@/components/product-card"
import { payload } from "@/payload"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
    const { docs: categories } = await payload.find({
        collection: 'categories',
        depth: 0,
        select: {
            slug: true
        }
    })
    if(!categories) {
        return []
    }
    return categories.map((category) => ({
        slug: category.slug
    }))
}

const Categories = async ({ params }: {params: Promise<{slug: string}>}) => {
    const { slug } = await params
    const { docs: categories } = await payload.find({
        collection: 'categories',
        where: {
            slug: {
                equals: slug
            }
        }
    })
    console.log(categories)
    const [cat] = categories
    if(!cat) {
        return notFound()
    }
    const amount = cat.products?.docs?.length || 0

    return (
        <div>
            <h1>{cat.name} Category</h1>
            <p className='text-sm'>{amount} {amount === 1 ? 'Product' : 'Products'}</p>
            <hr className='mt-1 w-full stroke-neutral-700' />
            
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 py-1'>
            {cat.products?.docs?.filter(product => typeof product !== 'number').map((product) => (
                    <ProductCard 
                    categoryObj={cat}
                    product={product} 
                    key={product.id} />
            ))}
            </div>
            
        </div>
    )
}

export default Categories