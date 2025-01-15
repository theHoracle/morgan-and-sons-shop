'use client'
import { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Media, Product } from '@/payload-types'
import { AddToCart } from '@/components/cart/add-to-cart'
import { formatNairaPrice } from '@/lib/helpers'
import { Input } from './ui/input'

const ProductPage = (props: { product: Product }) => {
  const { product } = props
  const [selectedVariant, setSelectedVariant] = useState(product.variantInventory?.[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(product.variantInventory?.[0]?.size || null)
  const [selectedColor, setSelectedColor] = useState<string | null>(product.variantInventory?.[0]?.color || null)

  const images: Media[] = Array.isArray(product.images) ? product.images.filter((img): img is Media => typeof img !== 'number') : []

  // Get unique sizes and colors from variant
  const sizes = Array.from(new Set(product.variantInventory?.map(v => v.size) || []))
  const colors = Array.from(new Set(product.variantInventory?.map(v => v.color) || []))

  // Update selected variant when size or color changes
  const updateSelectedVariant = (size: string | null, color: string | null) => {
    const variant = product.variantInventory?.find(
      v => v.size === size && v.color === color
    ) || null
    setSelectedVariant(variant)
  }

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
    updateSelectedVariant(size, selectedColor)
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    updateSelectedVariant(selectedSize, color)
  }

  const handleChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const getOnlyNums = e.target.value.replace(/[^0-9]/g, '')
    if(!getOnlyNums) return;
    setQuantity(parseInt(getOnlyNums))
  }

  return (
    <div className="container mx-auto bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto md:h-[calc(100lvh - 80px)] px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Desktop Gallery */}
            <div className="hidden md:block">
              <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={images[selectedImage].url ?? "/placeholder.png"}
                  alt={images[selectedImage].alt ?? "image placeholder"}
                  layout="fill"
                  objectFit="cover"
                  className="transition-all duration-300 ease-in-out transform hover:scale-105"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg ${
                      selectedImage === index ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Image
                      src={image.url ?? "/placeholder.png"}
                      alt={image.alt ?? "image placeholder"}
                      fill
                      objectFit="cover"
                      className="transition-all duration-300 ease-in-out transform hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            </div>
            {/* Mobile Slider */}
            <div className="block md:hidden">
              <Carousel>
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-square overflow-hidden rounded-xl">
                        <Image
                          src={image.url ?? "/placeholder.png"}
                          alt={image.alt ?? "image placeholder"}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-2">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full mx-1 ${
                        selectedImage === index ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </Carousel>
            </div>
          </div>

          {/* Product Information */}
          <div className="md:space-y-2 lg:space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-xl text-gray-600">{product.description}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary">
                {formatNairaPrice(selectedVariant?.price || product.price)}
              </span>
              {product.priceRange?.min && product.priceRange?.max && (
                <span className="text-lg text-gray-500">
                  {formatNairaPrice(product.priceRange.min)} - {formatNairaPrice(product.priceRange.max)}
                </span>
              )}
            </div>

            {/* Variant Selection */}
            <div className="space-y-3 lg:space-y-6">
              {/* Size Selection */}
              {sizes.length > 0 && (
                <div className="space-y-2 lg:space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Size</label>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <Button key={size} onClick={() => handleSizeChange(size ?? '')}
                        variant={selectedSize === size ? "default" : "outline" }
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {colors.length > 0 && (
                <div className="space-y-2 lg:space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Color</label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <Button key={color} onClick={() => handleColorChange(color ?? '')}
                        variant={selectedColor === color? "default" : "outline"} >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 lg:space-y-4 py-4 md:py-0">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input value={quantity} type='text'
                  className="text-xl font-semibold text-center w-14"
                  onChange={handleChangeQuantity} />
                {/* <span >{quantity}</span> */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="py-3">
            <AddToCart product={product} 
              selectedVariantId={selectedVariant?.id || ''}
              quantity={quantity}
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage

