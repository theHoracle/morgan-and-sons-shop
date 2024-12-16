import { CollectionConfig } from "payload";

export const Menus: CollectionConfig = {
  slug: "menus",
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
        type: "join",
        collection: "categories",
        on: "menu",
    },
    
  ],
};
