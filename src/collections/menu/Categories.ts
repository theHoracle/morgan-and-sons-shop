import { slugify } from "@/lib/helpers";
import { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: "products",
      type: "join",
      collection: "products",
      on: "category",
    },
    {
      name: "menu",
      type: "relationship",
      relationTo: "menus",
      hasMany: false,
      required: true,
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === "create" || operation === "update") {
          if (data.name) {
            data.slug = slugify(data.name);
          }
        }
        return data;
      },
    ],
  },
};
