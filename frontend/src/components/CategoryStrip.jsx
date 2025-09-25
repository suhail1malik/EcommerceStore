import React from "react";
import { Link } from "react-router-dom";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

const CategoryStrip = () => {
  const { data, isLoading, isError } = useFetchCategoriesQuery();

  if (isError) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-4">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-9 w-24 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0 snap-start"
              />
            ))
          : data?.map((cat) => (
              <Link
                key={cat._id || cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="shrink-0 rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 snap-start"
              >
                {cat.name}
              </Link>
            ))}
      </div>
    </div>
  );
};

export default CategoryStrip;
