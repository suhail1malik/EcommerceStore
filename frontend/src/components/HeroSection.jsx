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
    <section className="relative overflow-hidden full-bleed bg-slate-50 dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800/80">
      {/* Absolute Grid & Mask to seamlessly blend with the body gradient */}
      <div className="absolute inset-0 bg-grid-slate-900 dark:bg-grid-white mask-hero-gradient pointer-events-none opacity-20 dark:opacity-30" />
      
      {/* Massive Glowing Orbs for the Aurora/Neon effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none flex justify-center items-center opacity-70">
        <div className="absolute top-[-20%] left-[10%] w-[40vw] h-[40vw] bg-emerald-400/30 dark:bg-emerald-500/15 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[10%] w-[35vw] h-[35vw] bg-teal-400/30 dark:bg-teal-500/15 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 grid grid-cols-2 gap-4 lg:gap-14 items-center">
        <div className="max-w-xl">
          <span className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold px-3 py-1 rounded-full text-xs tracking-wider mb-5">
            NEW SEASON
          </span>
          <h1 className="text-2xl sm:text-5xl lg:text-5xl xl:text-7xl font-extrabold tracking-tight mb-3 sm:mb-5 text-slate-900 dark:text-white leading-[1.05]">
            Find gear you <span className="relative inline-block"><span className="relative z-10 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">love</span></span> at 
            <span className="bg-gradient-to-r from-slate-700 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent"> unbeatable prices</span>
          </h1>
          <p className="text-xs sm:text-lg text-slate-600 dark:text-slate-300 mb-4 sm:mb-8 max-w-prose leading-relaxed">
            Explore top-rated products, fresh arrivals, and exclusive deals.
            Start your search or browse categories below.
          </p>

          {/* Desktop Search Form */}
          <form
            onSubmit={onSubmit}
            className="hidden sm:flex flex-row items-stretch gap-3"
          >
            <div className="relative flex-1">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 z-20">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path></svg>
              </span>
              <input
                type="search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full flex-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm pl-12 pr-5 py-3.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all focus:bg-white dark:focus:bg-slate-800"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3.5 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-md transition-all hover:shadow-lg hover:shadow-teal-500/20 hover:-translate-y-0.5 border border-emerald-400/50 flex items-center justify-center gap-2"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="rounded-full border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-slate-900 dark:text-slate-100 px-8 py-3.5 font-semibold hover:bg-white dark:hover:bg-slate-800 focus:outline-none transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Browse
            </button>
          </form>

          <div className="sm:hidden w-full">
            <button
              onClick={() => navigate("/shop")}
              className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-3 py-2 text-xs font-semibold shadow-md active:scale-95 transition-all hover:shadow-lg hover:shadow-teal-500/20 border border-emerald-400/50"
            >
              Shop Collection
            </button>
          </div>
        </div>

        <div className="w-full rounded-3xl shadow-2xl dark:shadow-none overflow-hidden transform lg:rotate-1 hover:rotate-0 transition-transform duration-500 border border-white/40 dark:border-slate-800/50">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
