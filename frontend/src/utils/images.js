const DEFAULT_PLACEHOLDER = "/uploads/default-product.jpg";

export const getImageSource = (imagePath = "") => {
  if (!imagePath) return DEFAULT_PLACEHOLDER;
  try {
    if (imagePath.startsWith("http")) {
      // Automatic Image Optimization if Cloudinary url
      if (imagePath.includes("res.cloudinary.com") && !imagePath.includes("q_auto") && imagePath.includes("/upload/")) {
        return imagePath.replace("/upload/", "/upload/q_auto,f_auto/");
      }
      return imagePath;
    }
  } catch {
    return DEFAULT_PLACEHOLDER;
  }

  // if absolute path from backend (starts with /), prepend BASE_URL at runtime
  const base = import.meta.env.VITE_BACKEND_URL || "";

  if (imagePath.startsWith("/")) return `${base}${imagePath}`;
  return `${base}/${imagePath}`;
};

export default getImageSource;
