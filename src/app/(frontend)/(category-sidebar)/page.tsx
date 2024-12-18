import { payload } from '@/payload'
import CategoryCarousel from '@/components/category-carousel'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const Page = async () => {
    const { docs: categories } = await payload.find({
        collection: 'categories', 
        depth: 0, 
     })

     console.dir("Categories: ", categories)
    return <div className="space-y-4">
        {categories?.map((category) => (
            <div 
            key={category.id}
            className=''
            >
                <h2
                className='font-semibold text-lg w-full'
                >{category.name}</h2>
                <hr className='w-full mb-4 stroke-neutral-700' />
                {/* display products in category */}
                <Suspense fallback={
                    <div className='grid grid-cols-4 gap-2 w-full'>
                        <Skeleton className='rounded-lg py-1' />
                        <Skeleton className='rounded-lg py-1' />
                        <Skeleton className='rounded-lg py-1' />
                        <Skeleton className='rounded-lg py-1' />
                    </div>
                }>
                {category.id && <CategoryCarousel categoryId={category.slug} />}
                </Suspense>
            </div>
        ))}
        
    </div>
}

export default Page