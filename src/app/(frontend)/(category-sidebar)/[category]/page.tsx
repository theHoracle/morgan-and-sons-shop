import { ProductCard } from "@/components/product-card"
import { payload } from "@/payload"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
    const { docs: categories } = await payload.find({
        collection: 'categories'
    })
    if(!categories) {
        return []
    }
    return categories.map((category) => ({
        slug: category.slug
    }))
}

const Categories = async (props: {
    params: Promise<{
        category: string
    }>
}) => {
    const { category } = await props.params
    const urlDecoded = decodeURIComponent(category)
    const { docs: categories } = await payload.find({
        collection: 'categories',
        where: {
            slug: {
                equals: urlDecoded
            }
        }
    })
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
            
            <div className='flex flex-row flex-wrap justify-center gap-2'>
            {cat.products?.docs?.filter(product => typeof product !== 'number').map((product) => (
                    <ProductCard product={product} key={product.id} />
            ))}
            </div>
            
        </div>
    )
}

export default Categories