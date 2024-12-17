import { Product } from "@/payload-types";
import { CollectionConfig } from "payload";

export const UsersCart: CollectionConfig = {
    slug: 'users-cart',
    admin: {
        group: 'users',
        hidden: true,
    },
    access: {
        read: () => true,
        update: () => true,
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            hasMany: false,
        },
        {
            name: 'total',
            type: 'number',
            required: true,
            admin: {
                readOnly: true,
            },
            hooks: {
                beforeChange: [
                  ({ data }) => {
                    let total = 0;
                    data?.items.forEach((item: {quantity: number, product: Product}) => {
                      total += item.product.price * item.quantity;
                    });
                    return { ...data, totalPrice: total };
                  }
                ],
            }
        },
        {
            name: 'items',
            type: 'array',
            label: 'Cart items',
            fields: [
                {
                    name: 'product',
                    type: 'relationship',
                    relationTo: 'products',
                    required: true,
                },
                {
                    name: 'variant',
                    type: 'group',
                    fields: [
                        {
                            name: 'price',
                            type: 'number',
                            required: true,
                        },
                        {
                            name: 'size',
                            type: 'text',
                        },
                        {
                            name: 'color',
                            type: 'text',
                        },
                    ],
                },
                {
                    name: 'quantity',
                    type: 'number',
                    required: true,
                    defaultValue: 1
                },
            ],
            required: true,
            defaultValue: []
        },
    ],
}