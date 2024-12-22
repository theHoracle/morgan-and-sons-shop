import { addItem, getCart, removeItem, createCart } from "@/components/cart/action"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['cart/add'],
        mutationFn: addItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

export const useRemoveItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['cart/remove'],
        mutationFn: removeItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};
