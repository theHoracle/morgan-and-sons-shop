import { payload } from '@/payload'
import CategoryCarousel from '@/components/category-carousel'

const Page = async ( ) => {
    const { docs: categories } = await payload.find({
        collection: 'categories', 
        depth: 0, 
     })
    console.dir(categories, { depth: null })
    return <div className="space-y-4">
        {categories.map((category) => (
            <div 
            key={category.id}
            className=''
            >
                <h2
                className='font-semibold text-lg w-full'
                >{category.name}</h2>
                <hr className='w-full mb-4 stroke-neutral-700' />
                {/* display products in category */}
                <CategoryCarousel categoryId={category.id} />
            </div>
        ))}
        
    </div>
}

export default Page