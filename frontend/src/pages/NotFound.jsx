import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="relative mb-8">
        <h1 className="text-8xl sm:text-9xl font-extrabold text-slate-100 dark:text-slate-800 tracking-tighter drop-shadow-sm">
          404
        </h1>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
          <span className="bg-emerald-500 text-white px-4 py-2 text-sm sm:text-lg font-bold rounded-lg shadow-xl -rotate-12 inline-block">
            Page Not Found
          </span>
        </div>
      </div>
      
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200 mt-4 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
        We Lost That Item!
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mt-3 text-base sm:text-lg max-w-md mx-auto">
        The product, category, or page you were looking for seems to have vanished from our catalog.
      </p>

      <Link
        to="/"
        className="mt-8 flex items-center gap-2 px-8 py-3.5 bg-slate-900 border border-slate-700 dark:bg-emerald-600 dark:border-transparent text-white font-bold rounded-[16px] hover:-translate-y-1 transition-all hover:shadow-xl active:scale-95"
      >
        ← Return to Marketplace
      </Link>
    </div>
  );
};

export default NotFound;
