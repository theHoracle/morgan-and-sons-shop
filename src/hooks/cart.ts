import { addItem, getCart, removeItem, createCart, getCookieCart } from "@/components/cart/action"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UsersCart } from "@/payload-types"

export const useGetCart = () => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: getCart
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
                await addItem({ currentCart: cart, selectedVariantId: item.selectedVariantId, product: item.product })
                
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
                await removeItem({ previousData: cart, itemId: item.itemId, removeCompletely: item.removeCompletely })    
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