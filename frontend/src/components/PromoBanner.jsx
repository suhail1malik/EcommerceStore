import React from "react";
import { useNavigate } from "react-router-dom";

const PromoBanner = ({
  badge = "Premium Event",
  title = "THE LUXURY FLASH SALE",
  subtitle = "Elevate your lifestyle with our most exclusive collection.",
  primaryBtnText = "Explore Deals",
  primaryBtnLink = "/shop?filter=deals",
  secondaryBtnText = "View Catalog",
  secondaryBtnLink = "/shop",
  className = "",
}) => {
  const navigate = useNavigate();

  return (
    <div className={`relative overflow-hidden rounded-[40px] bg-slate-900 p-6 sm:p-10 text-white border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_60px_rgba(245,158,11,0.05)] transition-shadow duration-500 ${className}`}>
      {/* Luxury Accents */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/20">
            <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-500">{badge}</span>
          </div>
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight uppercase">
            {title.split(" ").map((word, i) => 
              word.toLowerCase() === "luxury" ? (
                <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200"> {word} </span>
              ) : (
                <span key={i}> {word} </span>
              )
            )}
          </h3>
          <p className="text-slate-400 text-base leading-relaxed opacity-80">
            {subtitle}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row md:flex-col gap-4 shrink-0 w-full md:w-auto">
          <button 
            onClick={() => navigate(primaryBtnLink)}
            className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition-all shadow-xl active:scale-95 w-full sm:w-auto"
          >
            {primaryBtnText}
          </button>
          <button 
            onClick={() => navigate(secondaryBtnLink)}
            className="bg-slate-800/50 backdrop-blur-md text-white border border-slate-700 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-700 transition-all active:scale-95 w-full sm:w-auto"
          >
            {secondaryBtnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
