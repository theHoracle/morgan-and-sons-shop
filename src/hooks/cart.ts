import { addItem, getCart, removeItem, createCart } from "@/components/cart/action"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { cookies } from "next/headers"
import { UsersCart } from "@/payload-types"

const COOKIE_CART_KEY = "cart"

const getCookieCart = async (): Promise<UsersCart | null> => {
    const cart = (await cookies()).get(COOKIE_CART_KEY)?.value
    return cart ? JSON.parse(cart) : setCookieCart({
        items: [],
        total: 0,
        id: 0,
        user: 0,
        updatedAt: "",
        createdAt: ""
    })
}

const setCookieCart = async (cart: UsersCart) => {
    (await cookies()).set(COOKIE_CART_KEY, JSON.stringify(cart), { maxAge: 7 * 24 * 60 * 60, secure: true, sameSite: 'strict' })
    return getCookieCart()
}

export const useGetCart = () => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const serverCart = await getCart()
            if (serverCart) {
                return serverCart
            } else {
                return await getCookieCart()
            }
        }
    })
}

export const useCreateCart = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['cart'],
        mutationFn: createCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
    })
}

export const useAddItem = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['cart'],
        mutationFn: async (item: { selectedVariantId: string, product: any }) => {
            const cart = await getCookieCart()
            if (cart) {
                const updatedCart = await addItem({ currentCart: cart, selectedVariantId: item.selectedVariantId, product: item.product })
                await setCookieCart(updatedCart)
                return updatedCart
            } else {
                const serverCart = await getCart()
                if (serverCart) {
                    const updatedCart = await addItem({ currentCart: serverCart, selectedVariantId: item.selectedVariantId, product: item.product })
                    queryClient.invalidateQueries({ queryKey: ['cart'] })
                    return updatedCart
                }
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
    })
}

export const useRemoveItem = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['cart'],
        mutationFn: async (item: { itemId: string, removeCompletely?: boolean }) => {
            const cart = await getCookieCart()
            if (cart) {
                const updatedCart = await removeItem({ previousData: cart, itemId: item.itemId, removeCompletely: item.removeCompletely })
                await setCookieCart(updatedCart)
                return updatedCart
            } else {
                const serverCart = await getCart()
                if (serverCart) {
                    const updatedCart = await removeItem({ previousData: serverCart, itemId: item.itemId, removeCompletely: item.removeCompletely })
                    queryClient.invalidateQueries({ queryKey: ['cart'] })
                    return updatedCart
                }
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
    })
}