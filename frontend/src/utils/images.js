const DEFAULT_PLACEHOLDER = "/uploads/default-product.jpg";

export const getImageSource = (imagePath = "") => {
  if (!imagePath) return DEFAULT_PLACEHOLDER;
  try {
    if (imagePath.startsWith("http")) return imagePath;
  } catch {
    return DEFAULT_PLACEHOLDER;
  }

  // if absolute path from backend (starts with /), prepend BASE_URL at runtime
  const base = import.meta.env.VITE_BACKEND_URL || "";

  if (imagePath.startsWith("/")) return `${base}${imagePath}`;
  return `${base}/${imagePath}`;
};

export default getImageSource;
