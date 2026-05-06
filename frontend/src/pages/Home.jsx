import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductsQuery, useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Message from "../components/Message";
import ProductCard from "../pages/Products/ProductCard";
import HeroSection from "../components/HeroSection";
import CategoryStrip from "../components/CategoryStrip";
import FeaturesSection from "../components/FeaturesSection";
import { motion } from "framer-motion";
import SkeletonProductCard from "../components/SkeletonProductCard";

import PromoBanner from "../components/PromoBanner";

const Home = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetProductsQuery({ keyword });
  const { data: topProducts, isLoading: loadingTop } = useGetTopProductsQuery();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="overflow-hidden pb-20">
      {!keyword && (
        <>
          <HeroSection />
          <CategoryStrip />
        </>
      )}

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Rated Strip - Requested above CTA */}
        {!keyword && topProducts && topProducts.length > 0 && (
          <div className="py-12 border-b border-slate-100 dark:border-slate-800/50 mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Curated Excellence</span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Top Rated Selection</h3>
              </div>
              <button onClick={() => navigate("/shop")} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-500 transition-colors">View All</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {topProducts.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Promo Banner */}
        {!keyword && (
          <div className="mb-16 reveal" style={{ animationDelay: '200ms' }}>
            <PromoBanner 
              badge="Exclusive Offer"
              title="THE LUXURY FLASH SALE"
              subtitle="Elevate your lifestyle with our most exclusive collection. Limited quantities available for the next 24 hours."
              primaryBtnText="Explore Deals"
              secondaryBtnText="View Catalog"
            />
          </div>
        )}

        {/* Why Choose Us - Hidden if searching */}
        {!keyword && <FeaturesSection />}

        {/* Products Grid Section */}
        <div className="py-12 sm:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">
                {keyword ? `Search results for "${keyword}"` : "Our Collections"}
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {keyword ? "Discovery" : "Featured Products"}
              </h2>
            </div>
            
          </div>

          {isLoading ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {[...Array(12)].map((_, i) => <SkeletonProductCard key={i} />)}
             </div>
          ) : isError ? (
            <div className="py-10">
              <Message variant="error">
                {error?.data?.message || error?.error || "Failed to load products"}
              </Message>
            </div>
          ) : (
            <>
              {data?.products?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                  {data.products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border border-slate-100 dark:border-slate-800/50">
                  <div className="text-6xl mb-6 opacity-20">📦</div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">We couldn't find any products matching your current criteria.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
