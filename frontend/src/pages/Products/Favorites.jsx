import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct) || [];
  const favList = useMemo(() => favorites.filter(Boolean), [favorites]);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-8">
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
          <div className="text-center py-20">
            <p className="text-lg text-slate-300 mb-4">No favorites yet.</p>
            <Link
              to="/shop"
              className="inline-block px-5 py-2 rounded-md bg-pink-600 text-white"
            >
              Browse products
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
      </div>
    </section>
  );
};

export default Favorites;
