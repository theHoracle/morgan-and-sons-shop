import { payload } from "@/payload"
import { ProductCard } from "./product-card"

const CategoryCarousel = async (props: {
    categoryId: string | number
}) => {
    const { categoryId } = props
    const  { docs: products } = await payload.find({
        collection: 'products',
        where: {
            category: {
                equals: categoryId
            }
        },
        select: {
            title: true,
            slug: true,
            priceRange: true,
            image: true,
            category: true
        },
        depth: 1,
        limit: 5
    })
    return <div className='flex flex-row flex-wrap items-center gap-2 py-1'>
        {products.map((product) => (
            <ProductCard
             product={product} 
             key={product.id} />
        ))}
</div>
}

export default CategoryCarousel