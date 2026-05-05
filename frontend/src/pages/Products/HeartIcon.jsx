import React from "react";
import { useEffect } from "react";
import { FaHeart, FaRegHeart, FaVaadin } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice";

import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../utils/localstorage";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((p) => p._id === product._id);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, []);

  const toggleFavorites = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      // remove the product from the localStorage as well
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      // add the product to localStorage as well
      addFavoriteToLocalStorage(product);
    }
  };

  return (
    <div
      onClick={toggleFavorites}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-md border border-slate-200/50 dark:border-slate-700/50 hover:scale-110 transition-transform cursor-pointer"
    >
      {isFavorite ? (
        <FaHeart className="text-emerald-500 text-sm" />
      ) : (
        <FaRegHeart className="text-slate-400 dark:text-slate-500 text-sm" />
      )}
    </div>
  );
};

export default HeartIcon;
