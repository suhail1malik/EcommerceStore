import React from "react";
import { useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductCard from "../pages/Products/ProductCard";
import HeroSection from "../components/HeroSection";
import CategoryStrip from "../components/CategoryStrip";
import TopRow from "../components/TopRow";
import { motion } from "framer-motion";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError, error } = useGetProductsQuery({ keyword });

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1], staggerChildren: 0.1 } }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="overflow-hidden">
      {!keyword && (
        <motion.div variants={containerVariants}>
          <CategoryStrip />
          <HeroSection />
          <TopRow />
        </motion.div>
      )}
      {isLoading ? (
        <div className="py-20 flex justify-center"><Loader /></div>
      ) : isError ? (
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <Message variant="error">
            {error?.data?.message ||
              error?.error ||
              "An error occurred while fetching products"}
          </Message>
        </div>
      ) : (
        <motion.div variants={containerVariants}>
          {/* Products Grid */}
          <div className="w-full px-2 sm:px-4 lg:px-6 py-8 sm:py-16">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-10 pb-4 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-emerald-100 dark:via-emerald-300 dark:to-emerald-100 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                Curated Catalog
              </h2>
              <div className="px-4 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/80 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-slate-700 flex items-center gap-2 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                {data?.products?.length || 0} Models Available
              </div>
            </div>
            
            {data?.products?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 pb-6 pt-2">
                {data.products.map((product) => (
                  <motion.div 
                    key={product._id} 
                    variants={{
                      hidden: { opacity: 0, scale: 0.95 },
                      visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
                    }}
                  >
                      <div className="w-full h-full self-stretch">
                        <ProductCard product={product} />
                      </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-gray-50 dark:bg-slate-800/40 rounded-[32px] border border-gray-100 dark:border-slate-700/50 shadow-inner">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl mx-auto shadow-sm flex items-center justify-center mb-4 text-4xl">
                  🔍
                </div>
                <p className="text-gray-400 dark:text-slate-500 text-lg font-medium font-serif italic">No exact matches found for this aesthetic.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Home;
