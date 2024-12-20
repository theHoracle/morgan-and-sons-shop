import { Access, CollectionConfig } from "payload";

const isAdminOrOwner: Access = ({ req, data })  => {
    if(req?.user?.role === 'admin') return true
    if(req?.user?.id === data?.user) return true
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
            name: 'order',
            type: 'relationship',
            relationTo: 'users-cart',
            required: true,
            hasMany: false,
            access: {
                update: () => false  
            },
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
        },
        {
            name: 'paymentStatus',
            type: 'select',
            options: [
                {
                    label: 'Pending',
                    value: 'pending'
                },
                {
                    label: 'Paid',
                    value: 'paid'
                }
            ],
            defaultValue: 'pending',
            required: true,
            access: {
                update: () => false
            }
        }
    ]
 }