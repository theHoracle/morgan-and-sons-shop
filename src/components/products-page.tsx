'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Product } from '@/payload-types'
import { AddToCart } from '@/components/cart/add-to-cart'

const ProductPage = (props: { product: Product }) => {
  const { product } = props
  const [selectedVariant, setSelectedVariant] = useState(product.variantInventory?.[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(product.variantInventory?.[0]?.size || null)
  const [selectedColor, setSelectedColor] = useState<string | null>(product.variantInventory?.[0]?.color || null)

  const images = Array.isArray(product.image) ? product.image : [product.image]

  // Get unique sizes and colors from variants
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

  return (
    <div className="container mx-auto px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Desktop Gallery */}
            <div className="hidden lg:block">
              <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={images[selectedImage].url}
                  alt={images[selectedImage].alt}
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
                      src={image.url}
                      alt={image.alt}
                      layout="fill"
                      objectFit="cover"
                      className="transition-all duration-300 ease-in-out transform hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            </div>
            {/* Mobile Slider */}
            <div className="lg:hidden">
              <Carousel>
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-square overflow-hidden rounded-xl">
                        <Image
                          src={image.url}
                          alt={image.alt}
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
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-xl text-gray-600">{product.description}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary">
                ${selectedVariant?.price || product.price}
              </span>
              {product.priceRange?.min && product.priceRange?.max && (
                <span className="text-lg text-gray-500">
                  ${product.priceRange.min} - ${product.priceRange.max}
                </span>
              )}
            </div>

            {/* Variant Selection */}
            <div className="space-y-6">
              {/* Size Selection */}
              {sizes.length > 0 && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Size</label>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeChange(size ?? '')}
                        className={`px-4 py-2 rounded-md border-2 transition-all duration-200 ${
                          selectedSize === size
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 hover:border-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {colors.length > 0 && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Color</label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color ?? '')}
                        className={`px-4 py-2 rounded-md border-2 transition-all duration-200 ${
                          selectedColor === color
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 hover:border-primary'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <AddToCart product={product} selectedVariantId={selectedVariant?.id || ''} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage

