// src/Products/SmallProduct.jsx
import React from "react";
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import Tilt from "react-parallax-tilt";
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

import { getImageSource } from "../../utils/images";

const SmallProduct = ({ product }) => {
  return (
    // card: fixed max width, full height so grid/flex children align
    <Tilt
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      perspective={1000}
      scale={1.03}
      transitionSpeed={1000}
      className="group bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 w-full max-w-[16rem] h-full flex flex-col"
    >
      {/* Absolute Heart Icon isolated from Link boundary */}
      <div className="absolute top-2 right-2 z-20">
        <HeartIcon product={product} />
      </div>

      {/* Main clickable wrapper */}
      <Link to={`/product/${product._id}`} className="flex-1 flex flex-col focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded relative z-10 w-full h-full">
        {/* image (fixed aspect) */}
        <div className="relative aspect-square bg-slate-800">
          <img
            src={getImageSource(product.image)}
            alt={product.name || "Product image"}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/400x300/374151/9ca3af?text=No+Image";
            }}
          />
        </div>

        {/* content area: grows to fill, so footer aligns bottom */}
        <div className="px-3 py-3 flex-1 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
            {product.name}
          </h3>

          <div className="mt-auto flex items-end justify-between gap-3 pt-3">
            <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              {product.brand}
            </div>
            <div className="text-sm font-semibold text-emerald-500">
              ₹{Number(product.price || 0).toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </Link>
    </Tilt>
  );
};

export default SmallProduct;
