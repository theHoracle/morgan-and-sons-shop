import { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    delete: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
  },
  upload: {
    staticDir: "media",
    disableLocalStorage: true,
    adminThumbnail: 'thumbnail', // ({ doc }) => `${doc.thumbnailURL}`
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        height: undefined,
        position: "centre",
      },
    ],
    mimeTypes: ["image/*"],
  },
  disableDuplicate: true,

  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: "productImages",
      type: "join",
      collection: "products",
      on: "images",
    }
  ],
};
