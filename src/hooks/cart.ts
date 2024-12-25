import { addItem, getCart, removeItem, createCart } from "@/components/cart/action"
import { useCart } from "@/components/cart/cart-context"
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
    const { addCartItem } = useCart()
    return useMutation({
        mutationKey: ['cart/add'],
        mutationFn: addItem,
        onMutate: async ({selectedVariantId, product, quantity}) => {
            addCartItem(selectedVariantId, product, quantity);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

export const useRemoveItem = () => {
    const queryClient = useQueryClient();
    const { deleteCartItem } = useCart();
    return useMutation({
        mutationKey: ['cart/remove'],
        mutationFn: removeItem,
        onMutate: async ({itemId, removeCompletely}) => {
            deleteCartItem(itemId, removeCompletely);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};
