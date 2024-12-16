import { getPayload } from 'payload'
import config from '@payload-config'
import { ProductCard } from '@/components/product-card'

const Page = async ( ) => {
    const payload = await getPayload({ config })
    const { docs: categories } = await payload.find({ collection: 'category', depth: 3, 
        select: {
            id: true,
            name: true,
            relatedProducts: true
        }
     })
    console.dir(categories, { depth: null })
    return <div>
        {/* <h1 className="text-3xl font-bold">The Home</h1> */}
        {categories.map((category) => (
            <div 
            key={category.id}
            className='my-4'
            >
                <h2
                className='font-semibold text-lg w-full'
                >{category.name}</h2>
                <hr className='mt-1 w-full stroke-neutral-700' />
                <div className='flex flex-row flex-wrap items-center gap-2 py-1'>
                    {category.relatedProducts?.docs?.filter(product => typeof product !== 'number').map((product) => (
                            <ProductCard product={product} key={product.id} />
                    ))}
                </div>
            </div>
        ))}
        
    </div>
}

export default Page