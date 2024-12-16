import { slugify } from "@/lib/helpers";
import { CollectionConfig } from "payload";

export const Category: CollectionConfig = {
  slug: "category",
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
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
    {
      name: "relatedProducts",
      type: "join",
      collection: "products",
      on: "category",
    },
    {
      name: "relatedCategories",
      type: "join",
      collection: "category",
      on: "menu",
    },
    {
      name: "menu",
      type: "relationship",
      relationTo: "menu",
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
