import { addItem, getCart, removeItem, createCart, getCartById } from "@/components/cart/action"
import { UsersCart } from "@/payload-types"
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
        mutationFn: addItem,
        onMutate: async ({ selectedVariantId, product, quantity = 1 }) => {
          await queryClient.cancelQueries({ queryKey: ['cart'] });
    
          const previousCart = queryClient.getQueryData<UsersCart>(['cart']);
    
          if (previousCart) {
            const existingItemIndex = previousCart.items?.findIndex(item => item.variantId === selectedVariantId) ?? -1;
            let updatedItems;
    
            if (existingItemIndex > -1) {
              updatedItems = previousCart?.items?.map((item, index) =>
                index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
              );
            } else {
              updatedItems = [...(previousCart.items || []), { id: '', variantId: selectedVariantId, product, quantity, subTotal: product.price * quantity }];
            }
    
            queryClient.setQueryData(['cart'], { ...previousCart, items: updatedItems });
          }
    
          return { previousCart };
        },
        onError: (err, variables, context) => {
          if (context?.previousCart) {
            queryClient.setQueryData(['cart'], context.previousCart);
          }
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
      });
    };

export const useRemoveItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: removeItem,
        onMutate: async ({ itemId, removeCompletely }) => {
          await queryClient.cancelQueries({ queryKey: ['cart'] });
    
          const previousCart = queryClient.getQueryData<UsersCart>(['cart']);
    
          if (previousCart) {
            let updatedItems;
    
            if (removeCompletely) {
              updatedItems = previousCart.items?.filter(item => item.id !== itemId) ?? -1;
            } else {
              updatedItems = previousCart.items?.map(item =>
                item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
              ).filter(item => item.quantity > 0);
            }
    
            queryClient.setQueryData(['cart'], { ...previousCart, items: updatedItems });
          }
    
          return { previousCart };
        },
        onError: (err, variables, context) => {
          if (context?.previousCart) {
            queryClient.setQueryData(['cart'], context.previousCart);
          }
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
      });
    };
