import React from "react";
import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import ProductCard from "../pages/Products/ProductCard";

const TopRow = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();
  console.log(data);

  if (error) return <p className="text-red-500">Failed to load products.</p>;

  return (
    <section className="w-full px-2 sm:px-4 lg:px-6 py-6">
      <div className="flex items-center justify-between mb-5 border-b border-gray-100 dark:border-slate-800 pb-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-emerald-100 dark:via-emerald-300 dark:to-emerald-100 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
          Top Rated
        </h2>
        <Link
          to="/shop"
          className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 text-sm sm:text-base font-bold uppercase tracking-wider relative group"
        >
          View all
          <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 pb-6 pt-2">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-full h-full min-h-[320px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3 animate-pulse"
              >
                <div className="w-full h-2/3 rounded-xl bg-slate-200 dark:bg-slate-700 mb-4" />
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            ))
          : data?.slice(0, 8).map((p) => (
              <div key={p._id} className="w-full h-full self-stretch">
                <ProductCard product={p} />
              </div>
            ))}
      </div>
    </section>
  );
};

export default TopRow;
