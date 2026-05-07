import React from "react";
import { Link } from "react-router-dom";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

const CategoryStrip = () => {
  const { data, isLoading, isError } = useFetchCategoriesQuery();

  if (isError) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start gap-6 sm:gap-10 lg:gap-14 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 md:justify-center">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 dark:bg-slate-900 animate-pulse shrink-0 snap-start border border-slate-200 dark:border-slate-800"
              />
            ))
          : (
              <>
                {data?.map((cat) => (
                  <Link
                    key={cat._id || cat.name}
                    to={`/shop?category=${encodeURIComponent(cat.name)}`}
                    className="flex flex-col items-center gap-3 shrink-0 snap-start group"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-slate-100 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center p-1 shadow-sm group-hover:border-indigo-500 group-hover:shadow-lg group-hover:shadow-indigo-500/10 transition-all duration-300">
                      <img 
                        src={cat.image || "/images/placeholder.png"} 
                        alt={cat.name} 
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => { e.target.src = "/images/placeholder.png"; }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-black text-slate-800 dark:text-slate-300 uppercase tracking-widest whitespace-nowrap text-center transition-colors group-hover:text-indigo-500">
                      {cat.name}
                    </span>
                  </Link>
                ))}
                
                {/* View All Button */}
                <Link
                  to="/shop"
                  className="flex flex-col items-center gap-3 shrink-0 snap-start group"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 group-hover:border-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-all duration-300">
                    <span className="text-slate-400 group-hover:text-indigo-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap text-center group-hover:text-indigo-500 transition-colors">
                    View All
                  </span>
                </Link>
              </>
            )}
      </div>
    </div>
  );
};

export default CategoryStrip;
