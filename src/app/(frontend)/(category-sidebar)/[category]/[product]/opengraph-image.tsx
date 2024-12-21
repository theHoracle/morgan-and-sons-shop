// import { ImageResponse } from 'next/og'
// import { notFound } from "next/navigation"

// export const runtime = 'edge';

// // Image metadata
// export const alt = "About the product";
// export const size = {
//   width: 1200,
//   height: 630,
// };
// export const contenType = "image/png"


// export default async function Image (props: {
//     params: Promise<{
//         product: string
//     }>
// }) {
//     const { product: productParam } = await props.params
//     const decodedProduct = decodeURIComponent(productParam)
//     // const { docs: products } = await payload.find({
//     //     collection: 'products',
//     //     where: {
//     //         slug: {
//     //             equals: decodedProduct
//     //         }
//     //     }
//     // })
//     // const [product] = products
//     // if(!product) return notFound()
//     const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/product?productSlug=${decodedProduct}`)
//     if(!res.ok) return notFound()
//     const product = await res.json()
//     const productImage = typeof product.image !== 'number' ? product.image.url as string : "/product-placeholder.svg"

//     return new ImageResponse((
//         <div
//         style={{
//           width: "100%",
//           height: "100%",
//           display: "flex",
//           backgroundColor: "#fff",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             marginBottom: "20px",
//           }}
//         >
//           <div
//             style={{
//               width: "200px",
//               height: "200px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             <img
//               style={{
//                 width: "300px",
//                 marginBottom: "30px",
//               }}
//               src={productImage}
//               alt={product.title}
//             />
//           </div>
//         </div>
//         <h1
//           style={{
//             fontSize: "64px",
//             fontWeight: "bold",
//             color: "#333",
//             marginBottom: "20px",
//           }}
//         >
//           {product.title}
//         </h1>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-around",
//             width: "100%",
//           }}
//         >
//           <div
//             style={{ textAlign: "center", display: "flex", fontSize: "24px" }}
//           >
//             {product.description}
//           </div>
//         </div>
//         <div
//           style={{
//             textAlign: "center",
//             display: "flex",
//             fontSize: "24px",
//             marginTop: "10px",
//           }}
//         >
//           ${product.price}
//         </div>
//       </div>
//     ), {
//         width: 1200,
//         height: 630
//     })

// }