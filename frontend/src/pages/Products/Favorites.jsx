import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct) || [];
  const favList = useMemo(() => favorites.filter(Boolean), [favorites]);
  const { data: topProducts } = useGetTopProductsQuery();

  return (
    <motion.section 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full px-4 sm:px-6 lg:px-12 py-8"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Favorite Products</h1>
            <p className="text-sm text-slate-400 mt-1" aria-live="polite">
              {favList.length} item{favList.length !== 1 ? "s" : ""}
            </p>
          </div>

          {favList.length > 0 && (
            <div className="hidden sm:block">
              <Link
                to="/shop"
                className="text-sm px-3 py-1 rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800"
              >
                Continue shopping
              </Link>
            </div>
          )}
        </div>

        {favList.length === 0 ? (
          <div className="max-w-3xl mx-auto text-center py-20 bg-slate-50 dark:bg-slate-900/40 rounded-[32px] border border-slate-100 dark:border-slate-800/50">
            <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full mx-auto flex items-center justify-center text-emerald-500 mb-6 shadow-sm border border-slate-100 dark:border-slate-800/50">
              <FaHeart size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">No favorites yet</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Your wishlist is currently empty. Start exploring our collections and save the pieces you love.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold tracking-widest uppercase text-sm shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95"
            >
              Discover Collections
            </Link>
          </div>
        ) : (
          <div
            role="list"
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {favList.map((product) => (
              <div role="listitem" key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Suggested Products */}
        {topProducts && topProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold mb-6">Suggested for you</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
               {topProducts.slice(0, 4).map(p => (
                  <div key={p._id}>
                    <ProductCard product={p} />
                  </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Favorites;
