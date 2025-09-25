// src/pages/Products/FavoritesCount.jsx
import React from "react";
import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";

const FavoritesCount = () => {
  // use consistent selector
  const favorites = useSelector(selectFavoriteProduct) || [];
  const favoriteCount = favorites.length;

  if (favoriteCount === 0) return null;

  return (
    <span
      aria-label={`You have ${favoriteCount} favorite ${
        favoriteCount === 1 ? "item" : "items"
      }`}
      aria-live="polite"
      className="absolute -top-2 -right-2 min-w-4 h-4 px-1 text-[11px] leading-4 text-white bg-pink-500 rounded-full text-center"
    >
      {favoriteCount}
    </span>
  );
};

export default FavoritesCount;
