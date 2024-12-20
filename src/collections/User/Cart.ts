import { CollectionConfig } from "payload";

export const UsersCart: CollectionConfig = {
  slug: "users-cart",
  admin: {
    group: "users",
    hidden: true,
  },
  access: {
    read: ({ req: { user } }) => !!user, // Restrict cart access to logged-in users
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
    },
    {
      name: "items",
      type: "array",
      label: "Cart Items",
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        {
          name: "variantId",
          type: "text",
        },
        {
          name: "quantity",
          type: "number",
          required: true,
          defaultValue: 1,
        },
        {
          name: "subTotal",
          type: "number",
          admin: {
            readOnly: true,
          },
          hooks: {
            beforeChange: [
              ({ data }) => {
                if(data?.variantId && data?.product) {
                  const variant = data.product.variants?.find((variant: any) => variant.id === data.variantId);
                  data.subTotal = variant?.price * data.quantity;
                } else if(data?.product) {
                  data.subTotal = data.product.price * data.quantity;
                }
                return data;
              },
            ],
          },
        },
      ],
    },
    {
      name: "total",
      type: "number",
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            const total = data?.items?.reduce((sum: number, item: any) => sum + (item.subTotal || 0), 0);
            return { ...data, total };
          },
        ],
      },
    },
  ],
};
