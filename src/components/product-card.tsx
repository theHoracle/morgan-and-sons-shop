import Image from 'next/image'
import Link from 'next/link'
import { Category, Product } from '@/payload-types'
import { formatNairaPrice } from '@/lib/helpers'
import { payload } from '@/payload'
import { Suspense, useEffect, useState } from 'react'
import { Skeleton } from './ui/skeleton'

interface ProductCardProps {
  product: Partial<Product>
  categoryObj?: Category
}

export function ProductCard({ product, categoryObj }: ProductCardProps) {
  const { title, image, priceRange, slug, category } = product
  
  if(!title || !image || !priceRange || !slug || !category) return null

  const imageUrl = typeof image === "number" 
  ? null
  : image.thumbnailURL
  // Format the price, or use a placeholder if price is undefined
 

  const formattedPrice = priceRange.max && priceRange.min === priceRange.max 
    ? formatNairaPrice(priceRange.max) 
    : priceRange.min && priceRange.max 
      ? `${formatNairaPrice(priceRange.min)} - ${formatNairaPrice(priceRange.max)}`
      : 'Price not available'

  const categorySlug = typeof category !== 'number' ? category.slug : categoryObj?.slug
  return (
    <Link 
    href={`/${categorySlug}/${slug}`}
    className="bg-stone-100 hover:bg-stone-200 rounded-lg overflow-hidden max-w-56 w-full flex flex-col">
      <div className="relative w-full  aspect-square">
        {imageUrl ?  <Image
          src={imageUrl}
          alt={`${title} image`}
          fill
          className="object-cover object-center"
        /> : (
          <Suspense fallback={<Skeleton className="absolute inset-0" />}>
            {typeof image === 'number' && <ImageComponent imageId={image} />}
          </Suspense>
        )}
      </div>
      <div className="flex flex-col items-center py-2 gap-1">
        <h3 className="truncate">{title}</h3>
        <p className="text-lg font-bold">{formattedPrice}</p>
      </div>
    </Link>
  )
}


const ImageComponent = async ({imageId}: {imageId: number}) => {
  async function getImage() {
    "use server"
    const { thumbnailURL, alt, url   } = await payload.findByID({
    collection: 'media',
    id: imageId,
    select: {
      thumbnailURL: true,
      alt: true,
      url: true
    }
  })
  return { thumbnailURL, alt, url }
}
  if(!imageId) return null
  const { thumbnailURL, alt, url } = await getImage()
  console.log(thumbnailURL)
  return (
    <Image
      src={thumbnailURL || url || "/placeholder.png"}
      alt={alt ?? "Image"}
      fill
      className="object-cover object-center"
    />
  )
}