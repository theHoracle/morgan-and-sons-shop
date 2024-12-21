import { Access } from "payload";

// Make a unique slug from the title string
export function slugify(title: string): string {
    return title
      .trim() // Remove leading and trailing whitespace
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, "-") // Replace spaces (including multiple spaces) with a single hyphen
      .replace(/[^\w-]+/g, ""); // Remove non-word characters except hyphens
}

export const isAdminOrOwner: Access = ({ req, data })  => {
    if(req?.user?.role === 'admin') return true
    if(req?.user?.id === data?.user) return true
    return false   
}

// Format price with Naira symbol and local number formatting
export function formatNairaPrice(price: number): string {
    return `₦${price.toLocaleString('en-NG')}`;
}

