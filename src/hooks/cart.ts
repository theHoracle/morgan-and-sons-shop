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
        mutationFn: async ({ selectedVariantId, product }: { selectedVariantId: string, product: any }) => {
            return await addItem({ selectedVariantId, product });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

export const useRemoveItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['cart/remove'],
        mutationFn: async ({ itemId, removeCompletely }: { itemId: string, removeCompletely?: boolean }) => {
            return await removeItem({ itemId, removeCompletely });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};
