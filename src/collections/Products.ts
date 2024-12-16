import { slugify } from "@/lib/helpers";
import { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
    slug: 'products',
    admin: {
        useAsTitle: 'title',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                hidden: true,
                readOnly: true,
            },
        },
        {
            name: 'description',
            type: 'text',
            required: true,
        },
        {
            name: 'price',
            label: 'Default price in NGN - variants can have different prices',
            type: 'number',
            required: true,
        },
        {
            name: 'priceRange',
            type: 'array',
            required: true,
            fields: [
                {
                    name: 'min',
                    type: 'number',
                },
                {
                    name: 'max',
                    type: 'number',
                }
            ],
            admin: {
                hidden: true,
                readOnly: true,
            },
        },
        {
            name: 'inventoryQuantity',
            label: 'Default inventory quantity - variants can have different quantities',
            type: 'number',
        },
        {
            name: 'category',
            type: 'relationship',
            relationTo: 'category',
            required: true,
            hasMany: false,
        },
        {
            name: 'variants',
            type: 'array',
            fields: [
                {
                    name: 'price',
                    type: 'number',
                },
                {
                    name: 'size',
                    type: 'text',
                },
                {
                    name: 'color',
                    type: 'text',
                },
                {
                    name: 'inventoryQuantity',
                    type: 'number',
                }
            ],
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
    ],
    hooks: {
        beforeChange: [
          ({ data, operation }) => {
            if (operation === "create" || operation === "update") {
            //   add product slug from title
                if (data.title) data.slug = slugify(data.title);
            //   add price range
              if(data.variants && Array.isArray(data.variants) && data.variants.length > 0) {
                const prices = data.variants.map((variant) => variant.price).filter(Boolean);
                if(prices?.length > 0) {
                    data.priceRange = [
                        {
                            min: Math.min(...prices),
                            max: Math.max(...prices),
                        }
                    ]
                } else {
                    data.priceRange = [{ min: data.price, max: data.price, }]}
            } else {
                data.priceRange = [{ min: data.price, max: data.price, }]
            }
            }
            return data;
          },
        ],
      },
}