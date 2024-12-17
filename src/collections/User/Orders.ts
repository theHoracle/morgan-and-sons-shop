import { Access, CollectionConfig } from "payload";

const isAdminOrOwner: Access = ({ req, data })  => {
    if(req?.user?.role === 'admin') return true
    if(req?.user?.id === data.user) return true
    return false
    
}

export const Orders: CollectionConfig = {
    slug: 'orders',
    access: {
        read: isAdminOrOwner
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true
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
        {
            name: 'total',
            type: 'number',
            required: true
        },
        {
            name: 'status',
            type: 'select',
            options: [
                {
                    label: 'Pending',
                    value: 'pending'
                },
                {
                    label: 'Shipped',
                    value: 'shipped'
                },
                {
                    label: 'Delivered',
                    value: 'delivered'
                }
            ],
            defaultValue: 'pending',
            required: true
        },
        {
            name: 'paymentId',
            type: 'text',
        }
    ]
 }