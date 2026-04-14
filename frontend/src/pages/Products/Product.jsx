// src/components/product/Product.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import "../../components/ProductCard.css";
import { getImageSource } from "../../utils/images";
import { formatCurrencyINR } from "../../utils/format";

const Product = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const src =
    !product || imageError ? getImageSource("") : getImageSource(product.image);

  return (
    /* flex + flex-col + h-full makes all cards same height in a row */
    <div className="product-card bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-full transition-all duration-300 relative group">
      {/* Full-card invisible link */}
      <Link 
        to={`/product/${product._id}`} 
        className="absolute inset-0 z-10 opacity-0"
        aria-label={`View details of ${product.name}`}
      />

      <div className="relative">
        {/* aspect-[4/5] */}
        <div
          className={`product-image-container ${
            imageLoaded ? "loaded" : ""
          } aspect-[4/5] bg-gray-100 dark:bg-slate-800 overflow-hidden relative`}
        >
          <img
            src={src}
            alt={product?.name || "product image"}
            className="product-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        </div>

        {/* wishlist heart in top-right */}
        <div className="absolute top-2 right-2 z-20">
          <HeartIcon product={product} />
        </div>

        {/* brand badge bottom-left */}
        {product?.brand && (
          <span className="absolute bottom-2 left-2 bg-emerald-600/90 text-white text-xs px-2 py-0.5 rounded-full z-20">
            {product.brand}
          </span>
        )}
      </div>

      {/* body */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col bg-white dark:bg-slate-900 relative z-0 pointer-events-none">
        <div className="block mt-1">
          <h2 className="product-name text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {product?.name}
          </h2>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg sm:text-xl font-semibold text-emerald-500 dark:text-emerald-400">
            {formatCurrencyINR(product?.price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Product;
