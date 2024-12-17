import { addItem, getCart, removeItem } from "@/app/(frontend)/cart/action"
import { Product, UsersCart } from "@/payload-types"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useGetCart = () => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: getCart
    })
}

export const useAddItem = () => {
    return useMutation({
        mutationKey: ['cart'],
        mutationFn: addItem
    })
}

export const useRemoveItem = () => {
    return useMutation({
        mutationKey: ['cart'],
        mutationFn: removeItem
    })
}