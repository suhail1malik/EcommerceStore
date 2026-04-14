import React from "react";
import { Link } from "react-router-dom";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

const CategoryStrip = () => {
  const { data, isLoading, isError } = useFetchCategoriesQuery();

  if (isError) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-6">
      <div className="flex items-start gap-4 md:gap-7 lg:gap-10 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 md:justify-center">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0 snap-start"
              />
            ))
          : data?.map((cat) => (
              <Link
                key={cat._id || cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center gap-2 shrink-0 snap-start group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full border border-emerald-200 dark:border-emerald-700 overflow-hidden bg-emerald-50 dark:bg-slate-800 flex items-center justify-center p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                  <img 
                    src={cat.image || "/images/placeholder.png"} 
                    alt={cat.name} 
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => { e.target.src = "/images/placeholder.png"; }}
                  />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight whitespace-nowrap text-center">
                  {cat.name}
                </span>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default CategoryStrip;
