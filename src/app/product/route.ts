import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url)
  const productSlug = searchParams.get('productSlug')
  
  const payload = await getPayload({
    config: configPromise,
  })

  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: productSlug,
      },
    },
    select: {
      title: true,
      price: true,
      image: true,
    },
  })
  const [product] = products
  if(!product) {
    return new Response('Product not found', { status: 404 })
  }
  return Response.json(product)
}
