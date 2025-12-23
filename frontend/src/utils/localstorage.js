// utils/favorites.js

const FAVORITES_KEY = "favorites";

// Internal helper to save
const saveFavoritesToLocalStorage = (favorites) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

// Retrieve favorites safely
export const getFavoritesFromLocalStorage = () => {
  try {
    const favoritesJSON = localStorage.getItem(FAVORITES_KEY);
    return favoritesJSON ? JSON.parse(favoritesJSON) : [];
  } catch (error) {
    console.error("Failed to parse favorites from localStorage:", error);
    return [];
  }
};

// Add a product
export const addFavoriteToLocalStorage = (product) => {
  if (!product || !product._id) return getFavoritesFromLocalStorage();

  const favorites = getFavoritesFromLocalStorage();
  if (!favorites.some((p) => p._id === product._id)) {
    favorites.push(product);
    saveFavoritesToLocalStorage(favorites);
  }
  return favorites;
};

// Remove a product
export const removeFavoriteFromLocalStorage = (productId) => {
  const favorites = getFavoritesFromLocalStorage();
  const updatedFavorites = favorites.filter((p) => p._id !== productId);
  saveFavoritesToLocalStorage(updatedFavorites);
  return updatedFavorites;
};
