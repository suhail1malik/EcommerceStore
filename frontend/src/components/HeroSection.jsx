import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroCarousel from "./HeroCarousel";

const HeroSection = () => {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const query = term.trim();
    if (query) navigate(`/shop?search=${encodeURIComponent(query)}`);
    else navigate("/shop");
  };

  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-10 sm:py-14 lg:py-16 flex flex-col lg:grid lg:grid-cols-2 gap-8 items-start lg:items-center">
        <div>
          <p className="text-pink-400 font-semibold tracking-wide mb-2">
            New Season
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            Find gear you love at unbeatable prices
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-prose">
            Explore top-rated products, fresh arrivals, and exclusive deals.
            Start your search or browse categories below.
          </p>

          <form
            onSubmit={onSubmit}
            className="flex flex-col sm:flex-row items-stretch gap-2"
          >
            <input
              type="search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full sm:flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="rounded-md bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="rounded-md border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-4 py-2 font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Browse
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
