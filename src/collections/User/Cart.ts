import { Access } from "payload";
import { CollectionConfig } from "payload";

const isOwnerOrAdminOrNoUser: Access = ({ req, data }) => {
  if(data?.cartStatus === "checkedOut") return false;
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
      name: "cartStatus",
      type: "select",
      options: [
        {
          label: "Awaiting Checkout",
          value: "awaitingCheckout",
        },
        {
          label: "Checked Out",
          value: "checkedOut",
        }
      ],
      defaultValue: "awaitingCheckout",
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
      async ({ data, operation }) => {
        if (operation === "create" || operation === "update") {
        // Calculate total
        data.total = data.items?.reduce(
          (sum: number, item: any) => sum + item.subTotal!,
          0
        );
      }
      return data;
      },
    ],
  },
};
