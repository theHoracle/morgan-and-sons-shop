import { slugify } from "@/lib/helpers";
import { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
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
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
    {
      name: "description",
      type: "text",
      required: true,
    },
    {
      name: "price",
      label: "Default price in NGN - variants can have different prices",
      type: "number",
      required: true,
    },
    {
        name: "priceRange",
        type: "group",
        fields: [
          {
            name: "min",
            type: "number",
          },
          {
            name: "max",
            type: "number",
          },
        ],
        admin: {
          readOnly: true,
          description: "Automatically calculated from variant prices.",
        },
    },      
    {
      name: "inventoryQuantity",
      label: "Default inventory quantity - variants can have different quantities",
      type: "number",
      required: true,
      admin: {
        description: "Set the total inventory for this product.",
      },
    },
    {
      name: "attributes",
      type: "group",
      fields: [
        {
          name: "sizes",
          type: "array",
          fields: [
            {
              name: "value",
              type: "text",
            },
          ],
          admin: {
            description: "Add all available sizes (e.g., Size 1, Size 2).",
          },
        },
        {
          name: "colors",
          type: "array",
          fields: [
            {
              name: "value",
              type: "text",
            },
          ],
          admin: {
            description: "Add all available colors (e.g., Red, Blue, White).",
          },
        },
      ],
    },
    {
      name: "pricingRules",
      type: "array",
      fields: [
        {
          name: "size",
          type: "text",
          required: false,
          admin: {
            placeholder: "e.g., Size 1 (leave empty for 'any size')",
          },
        },
        {
          name: "color",
          type: "text",
          required: false,
          admin: {
            placeholder: "e.g., White (leave empty for 'any color')",
          },
        },
        {
          name: "price",
          type: "number",
          required: true,
          admin: {
            description: "Set the price for this combination.",
          },
        },
      ],
      admin: {
        description: "Define pricing rules for specific combinations.",
      },
    },
    {
      name: "variantInventory",
      type: "array",
      fields: [
        {
          name: "id",
          type: "text",
          required: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: "size",
          type: "text",
        },
        {
          name: "color",
          type: "text",
        },
        {
          name: "price",
          type: "number",
          admin: {
            readOnly: true,
          },
        },
        {
          name: "inventoryQuantity",
          type: "number",
          admin: {
            description: "Set inventory for this specific variant.",
          },
        },
      ],
      admin: {
        description: "Manage inventory quantities for individual variants.",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      hasMany: false,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === "create" || operation === "update") {
          const sizes = data.attributes?.sizes?.map((s: any) => s.value) || [];
          const colors = data.attributes?.colors?.map((c: any) => c.value) || [];
          const pricingRules = data.pricingRules || [];
          const totalInventory = data.inventoryQuantity || 0;
  
          const autoGeneratedVariants = [];
  
          for (const size of sizes) {
            for (const color of colors) {
              // Find pricing rule for this variant
              const rule = pricingRules.find(
                (r: any) =>
                  // Match size: Either no size specified or it matches the provided size
                  (!r.size || r.size === size || r.size === null || r.size === "") &&
              
                  // Match color: Either no color specified or it matches the provided color
                  (!r.color || r.color === color || r.color === null || r.color === "")
              );
              
  
              const price = rule ? rule.price : data.price; // Default price if no rule matches
  
              // Check if inventory for this variant exists
              const existingVariant = data.variantInventory?.find(
                (v: any) => v.size === size && v.color === color
              );
  
              autoGeneratedVariants.push({
                id: existingVariant?.id || `${size}-${color}-${Date.now()}`,
                size,
                color,
                price,
                inventoryQuantity:
                  existingVariant?.inventoryQuantity ?? totalInventory,
              });
            }
          }
  
          // Update or create autoGeneratedVariants
          data.variantInventory = autoGeneratedVariants;
  
          // Calculate price range
          const prices = autoGeneratedVariants.map((variant) => variant.price);
          if (prices.length > 0) {
            data.priceRange = {
              min: Math.min(...prices),
              max: Math.max(...prices),
            };
          } else {
            // Default to the single product price if no variants exist
            data.priceRange = {
              min: data.price,
              max: data.price,
            };
          }
  
          // Generate product slug if missing
          if (data.title) {
            data.slug = slugify(data.title);
          }
        }
  
        return data;
      },
    ],
  },
  
};
