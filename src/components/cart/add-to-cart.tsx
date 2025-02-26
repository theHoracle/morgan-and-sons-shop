"use client"
import { useAddItem } from "@/hooks/cart";
import { Product } from "@/payload-types";
import clsx from "clsx";
import { PlusIcon } from "lucide-react";

function SubmitButton({
    availableForSale,
    selectedVariantId,
    quantity
  }: {
    availableForSale: boolean;
    selectedVariantId: string | undefined;
    quantity: number;
  }) {
    const buttonClasses =
      'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
    const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';
  
    if (!availableForSale) {
      return (
        <button disabled className={clsx(buttonClasses, disabledClasses)}>
          Out Of Stock
        </button>
      );
    }
  
    console.log(selectedVariantId);
    if (!selectedVariantId || !quantity || quantity < 1) {
      return (
        <button
          aria-label="Please select an option"
          disabled
          className={clsx(buttonClasses, disabledClasses)}
        >
          <div className="absolute left-0 ml-4">
            <PlusIcon className="h-5" />
          </div>
          Add To Cart
        </button>
      );
    }
  
    return (
      <button
        type="submit" // Fixed here
        aria-label="Add to cart"
        className={clsx(buttonClasses, {
          'hover:opacity-90': true
        })}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );    
  }

export function AddToCart({ product, selectedVariantId, quantity }: { product: Product, selectedVariantId: string, quantity: number }) {
    const { variantInventory } = product;
    const { mutate: addCartItem } = useAddItem();
    const availableForSale = variantInventory?.some((variant) => variant.inventoryQuantity ? variant.inventoryQuantity > 0 : false) || false;
    
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      addCartItem({selectedVariantId, product, quantity}); 
    };
  
    return (
      <form 
      onSubmit={handleSubmit}>
        <SubmitButton availableForSale={availableForSale}
         selectedVariantId={selectedVariantId}
         quantity={quantity}
         />
      </form>
    );
  }
