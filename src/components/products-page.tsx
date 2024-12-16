'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Product } from '@/payload-types'

const ProductPage = (props: { product: Product }) => {
  const { product } = props
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const images = Array.isArray(product.image) ? product.image : [product.image]

  const handleAddToCart = () => {
    console.log('Added to cart:', { product, variant: selectedVariant, quantity })
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Desktop Gallery */}
            <div className="hidden lg:block h-screen">
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
                <CarouselPrevious />
                <CarouselNext />
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
              {product.priceRange[0]?.min && product.priceRange[0]?.max && (
                <span className="text-lg text-gray-500">
                  ${product.priceRange[0].min} - ${product.priceRange[0].max}
                </span>
              )}
            </div>

            {product.variants && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Select Variant</label>
                <Select
                  onValueChange={(value) => setSelectedVariant(product.variants?.find(v => v.id === value) || null)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id || ''}>
                        {variant.size && `Size: ${variant.size}`}
                        {variant.color && ` - Color: ${variant.color}`}
                        {variant.price && ` - $${variant.price}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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

            <Button className="w-full text-lg py-6" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>

            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <span className="font-medium">Category:</span> {typeof product.category === 'number' ? `Category ${product.category}` : product.category.name}
                  </li>
                  {product.inventoryQuantity && (
                    <li>
                      <span className="font-medium">In Stock:</span> {product.inventoryQuantity}
                    </li>
                  )}
                  <li>
                    <span className="font-medium">Last Updated:</span> {new Date(product.updatedAt).toLocaleDateString()}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage

