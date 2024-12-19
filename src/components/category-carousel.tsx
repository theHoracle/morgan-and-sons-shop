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
        limit: 6
    })
    console.log("Products: ", products)
    return <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 py-1'>
        {products.map((product) => (
            <ProductCard
             product={product} 
             key={product.id} />
        ))}
</div>
}

export default CategoryCarousel