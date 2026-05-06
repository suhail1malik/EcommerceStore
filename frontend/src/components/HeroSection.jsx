import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HeroCarousel from "./HeroCarousel";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <section className="relative overflow-hidden full-bleed bg-slate-50 dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800/80">
      {/* Absolute Grid & Mask to seamlessly blend with the body gradient */}
      <div className="absolute inset-0 bg-grid-slate-900 dark:bg-grid-white mask-hero-gradient pointer-events-none opacity-20 dark:opacity-30" />
      
      {/* Massive Glowing Orbs for the CommerceHub effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none flex justify-center items-center opacity-70">
        <div className="absolute top-[-20%] left-[10%] w-[40vw] h-[40vw] bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[10%] w-[35vw] h-[35vw] bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-16 grid grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-14 items-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.span 
            variants={itemVariants}
            className="inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold px-4 py-1.5 rounded-full text-[10px] sm:text-xs tracking-widest mb-6 uppercase border border-indigo-200/50 dark:border-indigo-500/20"
          >
            Premium Experience
          </motion.span>
          <motion.h1 
            variants={itemVariants}
            className="text-xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white leading-tight"
          >
            SMART <br /> SHOPPING <br />
            <span className="bg-gradient-to-r from-indigo-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">STARTS HERE</span>
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-[9px] sm:text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-xl leading-snug"
          >
            Top-rated products, fresh arrivals — all in one place.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-row gap-2 sm:gap-4 items-center w-full"
          >
            <button 
              onClick={() => navigate("/shop")}
              className="flex-1 sm:flex-none px-3 sm:px-10 py-3 sm:py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[8px] sm:text-xs hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-1 sm:gap-3 group active:scale-95 whitespace-nowrap"
            >
              Explore
              <FaArrowRight className="text-[8px] sm:text-xs group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate("/shop?filter=deals")}
              className="flex-1 sm:flex-none px-3 sm:px-10 py-3 sm:py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[8px] sm:text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm whitespace-nowrap"
            >
              Deals
            </button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="w-full rounded-3xl shadow-2xl dark:shadow-none overflow-hidden transform lg:rotate-1 hover:rotate-0 transition-transform duration-500 border border-white/40 dark:border-slate-800/50"
        >
          <HeroCarousel />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
