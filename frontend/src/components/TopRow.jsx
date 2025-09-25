import React from "react";
import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";

const TopRow = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (error) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
          Top Rated
        </h2>
        <Link
          to="/shop"
          className="text-pink-600 hover:text-pink-700 text-sm font-medium"
        >
          View all
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-56 sm:w-60 shrink-0 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3 animate-pulse snap-start"
              >
                <div className="w-full aspect-[4/3] rounded-md bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 mt-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            ))
          : data?.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="w-56 sm:w-60 shrink-0 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3 hover:shadow-md transition snap-start"
              >
                <div className="w-full aspect-[4/3] overflow-hidden rounded-md">
                  <img
                    src={import.meta.env.VITE_BACKEND_URL + p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-2 text-sm text-slate-900 dark:text-slate-100 line-clamp-2">
                  {p.name}
                </div>
                <div className="text-pink-600 font-semibold">
                  {p.price?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
};

export default TopRow;
