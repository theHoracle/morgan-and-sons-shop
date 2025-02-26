import { isAdminOrOwner } from "@/lib/helpers";
import { Access, CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
    slug: 'orders',
    access: {
        read: isAdminOrOwner,
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
            name: 'orderTotal',
            type: 'number',
            required: true,
            access: {
                update: () => false
            }
        },
        {
            name: "deliveryDetails",
            type: "array",
            fields: [
                {
                    name: "fullname",
                    type: "text"
                },
                {
                    name: "address",
                    type: "text",
                },
                {
                    name: "paymentType",
                    type: "select",
                    options: [
                        {
                            label: "Paystack",
                            value: "paystack"
                        },
                        {
                            label: "Pay on delivery",
                            value: "onDelivery"
                        },
                    ]
                },
                {
                    name: "shipmentType",
                    type: "select",
                    options: [
                        {
                            label: "Delivery",
                            value: "delivery"
                        },
                        {
                            label: "Pickup",
                            value: "pickup"
                        }
                    ]
                }
            ]
        },
        {
            name: "deliveryDate",
            type: "text"
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
            name: 'referenceId',
            type: 'text',
            required: true,
            access: {
                update: () => false
            },
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