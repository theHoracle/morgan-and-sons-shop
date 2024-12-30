import { Access } from "payload";
import { CollectionConfig } from "payload";

const isOwnerOrAdminOrNoUser: Access = ({ req, data }) => {
  if(!(data?.user)) return true;
  if(req.user?.role === "admin") return true;
  if(req.user?.id === data.user?.id) return true;
  return false;
}

export const UsersCart: CollectionConfig = {
  slug: "users-cart",
  admin: {
    group: "users",
  },
  access: {
    read: isOwnerOrAdminOrNoUser,
    create: isOwnerOrAdminOrNoUser,
    update: isOwnerOrAdminOrNoUser,
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: false,
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
        },
      ],
    },
    {
      name: "total",
      type: "number",
      admin: {
        readOnly: true,
      },
      defaultValue: 0,
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Calculate subTotal for each item
        data.items = data.items?.map((item: any) => {
          const variant = item.product?.variants?.find(
            (v: any) => v.id === item.variantId
          );
          const price = variant?.price || item.product?.price || 0;
          return {
            ...item,
            subTotal: price * (item.quantity || 1),
          };
        });

        // Calculate total
        data.total = data.items?.reduce(
          (sum: number, item: any) => sum + (item.subTotal || 0),
          0
        );

        return data;
      },
    ],
  },
};
