import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast, Slide } from "react-toastify";
import HeartIcon from "./HeartIcon";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
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

  const getImageUrl = (img) => {
    if (!img) return "/images/placeholder.png"; // local placeholder in /public/images/
    if (img.startsWith("http")) return img; // Cloudinary or any external
    return `${BASE_URL}${img}`; // local backend uploads
  };

  return (
    <div className="group flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition overflow-hidden">
      {/* Image wrapper */}
      <section className="relative">
        <Link
          to={`/product/${product._id}`}
          className="block aspect-[3/3] bg-slate-100 dark:bg-slate-900 overflow-hidden"
        >
          <img
            src={getImageUrl(product.image)}
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
        </Link>
        {/* Heart / wishlist */}
        <div className="absolute top-2 right-2">
          <HeartIcon product={product} />
        </div>
        {/* Brand badge */}
        {product?.brand && (
          <span className="absolute bottom-2 left-2 bg-pink-600/90 text-white text-xs px-2 py-0.5 rounded-full">
            {product.brand}
          </span>
        )}
      </section>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        {/* Title + Price */}
        <div className="flex justify-between items-start">
          <Link to={`/product/${product._id}`}>
            <h5 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white line-clamp-2 group-hover:text-pink-600">
              {product?.name}
            </h5>
          </Link>
          <p className="ml-2 text-base font-semibold text-pink-600">
            {product?.price?.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </p>
        </div>

        {/* Description */}
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
          {product?.description}
        </p>

        {/* Actions */}
        <div className="mt-auto flex justify-between items-center pt-3">
          <Link
            to={`/product/${product._id}`}
            className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700"
          >
            Read More →
          </Link>

          <button
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
            onClick={() => addToCartHandler(product, 1)}
          >
            <AiOutlineShoppingCart
              size={20}
              className="text-slate-800 dark:text-white"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
