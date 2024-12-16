// Make a unique slug from the title string
export function slugify(title: string): string {
    return title
      .trim() // Remove leading and trailing whitespace
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, "-") // Replace spaces (including multiple spaces) with a single hyphen
      .replace(/[^\w-]+/g, ""); // Remove non-word characters except hyphens
}