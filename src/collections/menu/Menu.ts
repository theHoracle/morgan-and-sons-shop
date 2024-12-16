import { CollectionConfig } from "payload";

export const Menu: CollectionConfig = {
  slug: "menu",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "category",
      hasMany: true,
    },
  ],
};
