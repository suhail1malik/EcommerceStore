import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast, Slide } from "react-toastify";
import HeartIcon from "./HeartIcon";
import { getImageSource } from "../../utils/images";
import QuickViewModal from "./QuickViewModal";
import Ratings from "./Ratings";
import { AiOutlineShoppingCart, AiOutlineEye } from "react-icons/ai";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [showQuickView, setShowQuickView] = useState(false);
  
  if (!product) return null;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: "top-right",
      autoClose: 1000,
      transition: Slide,
    });
  };

  return (
    <div className="group relative flex flex-col h-full premium-card rounded-3xl overflow-hidden reveal bg-white dark:bg-slate-900 transition-all duration-500 hover:z-10">
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 dark:bg-slate-900/50">
        <Link to={`/product/${product._id}`} className="block h-full">
          <img
            src={getImageSource(product.image)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          {/* Subtle Overlay on Hover */}
          <div className="absolute inset-0 bg-black/5 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {product.isTopRated && (
            <span className="bg-indigo-600/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-xl">
              Top Rated
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-xl">
              {product.discount}% OFF
            </span>
          )}
        </div>

        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2.5 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)">
          <div className="hover:scale-110 transition-transform active:scale-95">
             <HeartIcon product={product} />
          </div>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCartHandler(product, 1);
            }}
            className="w-11 h-11 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-900 dark:text-white shadow-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-90"
            title="Add to Cart"
          >
            <AiOutlineShoppingCart size={20} />
          </button>

          <button 
            onClick={(e) => {
              e.preventDefault();
              setShowQuickView(true);
            }}
            className="w-11 h-11 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-900 dark:text-white shadow-xl hover:bg-indigo-500 hover:text-white transition-all active:scale-90"
            title="Quick View"
          >
            <AiOutlineEye size={20} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 gap-2">
        <div className="flex justify-between items-start gap-2">
          <Link 
            to={`/product/${product._id}`}
            className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1 hover:text-emerald-500 transition-colors duration-300"
          >
            {product.name}
          </Link>
        </div>
        
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          {product.brand}
        </p>

        {product.numReviews > 0 && (
          <div className="flex items-center gap-2 mb-1">
            <Ratings value={product.rating} text={""} color="#f59e0b" />
            <span className="text-[10px] font-black text-slate-400 tracking-tighter">({product.numReviews} REVIEWS)</span>
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50 dark:border-slate-800/40">
           <div className="flex items-center gap-3">
              <p className="text-xl font-black text-slate-950 dark:text-white tracking-tighter">
                {product.price?.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0
                })}
              </p>
              {product.originalPrice > product.price && (
                <span className="text-[13px] font-bold text-slate-400 line-through opacity-60">₹{product.originalPrice}</span>
              )}
           </div>
           
           {product.countInStock <= 0 && (
             <div className="flex gap-1.5 items-center bg-red-50 dark:bg-red-500/10 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-tight text-red-500">Sold Out</span>
             </div>
           )}
        </div>
      </div>

      <QuickViewModal 
        product={product} 
        isOpen={showQuickView} 
        onClose={() => setShowQuickView(false)} 
      />
    </div>
  );
};

export default ProductCard;
