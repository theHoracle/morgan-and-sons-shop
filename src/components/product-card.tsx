import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/payload-types'

interface ProductCardProps {
  product: Partial<Product>
}

export function ProductCard({ product }: ProductCardProps) {
  const { title, image, priceRange, slug, category } = product
  
  if(!title || !image || !priceRange || !slug || !category) return null

  const imageUrl = typeof image !== "number" && image.thumbnailURL ? image.thumbnailURL : "/image-placeholder.png"
  // Format the price, or use a placeholder if price is undefined
  const [price] = priceRange
  const formattedPrice = price.min === price.max ? `N ${price.max}` : `N ${price.min} - N ${price.max}`

  const categorySlug = typeof category !== 'number' ? category.slug : '/products'
  return (
    <Link 
    href={`/${categorySlug}/${slug}`}
    className="bg-stone-100 hover:bg-stone-200 rounded-lg overflow-hidden max-w-56 flex flex-col">
      <div className="relative w-56 aspect-square">
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

