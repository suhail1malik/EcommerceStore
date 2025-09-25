// src/Products/SmallProduct.jsx
import React from "react";
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

const getImageSrc = (img) => {
  if (!img)
    return "https://via.placeholder.com/400x300/374151/9ca3af?text=No+Image";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/uploads")) return `${BASE_URL}${img}`;
  return `${BASE_URL}/uploads/${img}`;
};

const SmallProduct = ({ product }) => {
  return (
    // card: fixed max width, full height so grid/flex children align
    <article className="group bg-slate-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition w-full max-w-[16rem] h-full flex flex-col">
      {/* image (fixed aspect) */}
      <div className="relative aspect-[4/3] bg-slate-800">
        <img
          src={getImageSrc(product.image)}
          alt={product.name || "Product image"}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/400x300/374151/9ca3af?text=No+Image";
          }}
        />
        <div className="absolute top-2 right-2 z-10">
          <HeartIcon product={product} />
        </div>
      </div>

      {/* content area: grows to fill, so footer aligns bottom */}
      <div className="px-3 py-3 flex-1 flex flex-col">
        <Link
          to={`/product/${product._id}`}
          className="block focus:outline-none focus:ring-2 focus:ring-pink-500 rounded"
        >
          <h3 className="text-sm font-semibold text-slate-100 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="text-xs text-slate-400 line-clamp-1">
            {product.brand}
          </div>
          <div className="text-sm font-semibold text-pink-500">
            ₹{Number(product.price || 0).toLocaleString("en-IN")}
          </div>
        </div>
      </div>
    </article>
  );
};

export default SmallProduct;
