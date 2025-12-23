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
    <div className="product-card bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <div className="relative">
        {/* aspect-[3/4] - shorter cards */}
        <div
          className={`product-image-container ${
            imageLoaded ? "loaded" : ""
          } aspect-[3/4] bg-slate-800 overflow-hidden`}
        >
          <img
            src={src}
            alt={product?.name || "product image"}
            className="product-image w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        </div>

        {/* wishlist heart in top-right */}
        <div className="absolute top-2 right-2 z-10">
          <HeartIcon product={product} />
        </div>

        {/* brand badge bottom-left */}
        {product?.brand && (
          <span className="absolute bottom-2 left-2 bg-pink-600/90 text-white text-xs px-2 py-0.5 rounded-full z-10">
            {product.brand}
          </span>
        )}
      </div>

      {/* body */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <Link
          to={`/product/${product._id}`}
          className="hover:opacity-90 transition-opacity"
        >
          <h2 className="product-name text-sm sm:text-base font-semibold text-white mb-1 line-clamp-2">
            {product?.name}
          </h2>
          <p className="text-xs text-slate-400 mb-2 line-clamp-1">
            {product?.description || ""}
          </p>
        </Link>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg sm:text-xl font-semibold text-pink-400">
            {formatCurrencyINR(product?.price)}
          </span>
          <span className="text-xs text-gray-400">
            {product?.countInStock > 0
              ? `${product.countInStock} in stock`
              : "Out of stock"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Product;
