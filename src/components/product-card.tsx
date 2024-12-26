import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/payload-types'
import { formatNairaPrice } from '@/lib/helpers'


interface ProductCardProps {
  product: Partial<Product>
}

export function ProductCard({ product }: ProductCardProps) {
  const { title, images, priceRange, slug, category } = product
  
  if(!title || !images || !priceRange || !slug || !category) return null

  const imageUrl = typeof images[0] === "number" 
  ? "/placeholder.png"
  : images[0].thumbnailURL ?? "/placeholder.png"
  // Format the price, or use a placeholder if price is undefined
 

  const formattedPrice = priceRange.max && priceRange.min === priceRange.max 
    ? formatNairaPrice(priceRange.max) 
    : priceRange.min && priceRange.max 
      ? `${formatNairaPrice(priceRange.min)} - ${formatNairaPrice(priceRange.max)}`
      : 'Price not available'

  const categorySlug = typeof category !== 'number' ? category.slug : null;
  return (
    <Link 
    href={`/${categorySlug}/${slug}`}
    className="bg-stone-100 hover:bg-stone-200 rounded-lg overflow-hidden max-w-56 w-full flex flex-col">
      <div className="relative w-full  aspect-square">
       <Image
          src={imageUrl}
          alt={`${title} image`}
          fill
          className="object-cover object-center"
        /> 
      </div>
      <div className="flex flex-col items-center py-2 gap-1">
        <h3 className="truncate">{title}</h3>
        <p className="text-lg font-bold">{formattedPrice}</p>
      </div>
    </Link>
  )
}
