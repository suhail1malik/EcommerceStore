import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast, Slide } from "react-toastify";
import HeartIcon from "./HeartIcon";
import Tilt from "react-parallax-tilt";
import { getImageSource } from "../../utils/images";
import QuickViewModal from "./QuickViewModal";
import { AiOutlineEye } from "react-icons/ai";
import { useState } from "react";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [showQuickView, setShowQuickView] = useState(false);
  // Removed console.log for security
  if (!product) return <h1>Error</h1>;
  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: "top-right",
      autoClose: 1000,
      transition: Slide,
    });
  };



  return (
    // The card spans full width of grid cell
    <Tilt
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      perspective={1000}
      scale={1.02}
      transitionSpeed={1500}
      glareEnable={true}
      glareMaxOpacity={0.15}
      glarePosition="all"
      className="product-card bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-shadow duration-300 overflow-hidden flex flex-col h-full group relative"
    >
      {/* Full-card invisible link */}
      <Link 
        to={`/product/${product._id}`} 
        className="absolute inset-0 z-10 opacity-0"
        aria-label={`View details of ${product.name}`}
      />

      {/* Image wrapper */}
      <section className="relative aspect-[4/5] bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0">
        <img
          src={getImageSource(product.image)}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // prevent infinite loop
            const fallback = "/images/placeholder.png";
            if (!e.target.src.includes(fallback)) {
              e.target.src = fallback;
            }
          }}
        />

        {/* Top Rated Badge */}
        {product.isTopRated && (
          <div className="absolute top-2 left-2 z-20">
            <div className="bg-emerald-500 text-white text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded shadow-lg shadow-emerald-500/40 border border-emerald-400/50">
              Top Rated
            </div>
          </div>
        )}
        
        {/* Favorite Icon */}
        <div className="absolute top-2 right-2 z-20">
          <HeartIcon product={product} />
        </div>
        
        {/* Rating overlay */}
        {(product?.rating > 0 || product?.numReviews > 0) && (
          <div className="absolute bottom-2 left-2 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-800 dark:text-slate-200 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-md border border-slate-200 dark:border-slate-700">
            <span>{product?.rating}</span>
            <span className="text-emerald-500 text-[10px]">★</span>
            <span className="text-slate-400 font-normal">|</span>
            <span>{product?.numReviews}</span>
          </div>
        )}
        
        {/* Action Sidebar (Hover Only) */}
        <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 ease-out">
           {/* Quick View */}
           <button
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               setShowQuickView(true);
             }}
             className="w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-full shadow-xl border border-slate-100 dark:border-slate-800 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 transition-all duration-300 hover:scale-110"
             title="Quick View"
           >
             <AiOutlineEye size={18} />
           </button>

           {/* Quick Add to Cart */}
           <button
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               addToCartHandler(product, 1);
             }}
             className="w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-full shadow-xl border border-slate-100 dark:border-slate-800 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white transition-all duration-300 hover:scale-110"
             title="Add to Cart"
           >
             <AiOutlineShoppingCart size={18} />
           </button>
        </div>
      </section>

      {/* Content */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-3.5 bg-white dark:bg-slate-900 transition-colors relative z-0 pointer-events-none">
        {/* Brand - Subtle */}
        <p className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 truncate">
          {product?.brand || "Brand"}
        </p>
        
        {/* Name - Bold and Clamped */}
        <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
          {product?.name}
        </h3>
        
        {/* Price Row */}
        <div className="mt-auto flex items-center flex-wrap gap-1.5 sm:gap-2 pt-1 border-t border-transparent">
          <span className="text-sm sm:text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
            {product?.price?.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0
            })}
          </span>
          {product?.originalPrice && (
            <span className="text-[10px] sm:text-xs text-slate-400 line-through">
              ₹{product?.originalPrice}
            </span>
          )}
          {product?.discount && (
            <span className="text-[10px] sm:text-xs font-bold text-teal-500">
              ({product.discount}% OFF)
            </span>
          )}
        </div>
      </div>

      {/* Modal is portal-like but local for ease of state */}
      <QuickViewModal 
        product={product} 
        isOpen={showQuickView} 
        onClose={() => setShowQuickView(false)} 
      />
    </Tilt>
  );
};

export default ProductCard;
