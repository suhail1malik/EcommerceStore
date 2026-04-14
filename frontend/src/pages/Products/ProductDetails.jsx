import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
  useGetTopProductsQuery,
} from "../../redux/api/productApiSlice";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { useMemo } from "react";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import { AiOutlineMinus, AiOutlinePlus, AiOutlineArrowLeft } from "react-icons/ai";
import { formatDistanceToNow } from "date-fns";
import HeartIcon from "../Products/HeartIcon";
import Ratings from "../Products/Ratings";
import ProductTabs from "../Products/ProductTabs";
import SmallProduct from "../Products/SmallProduct";
import { getImageSource } from "../../utils/images";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

/**
 * ProductDetails (responsive)
 * - Uses a centered max-width container
 * - Image left / details right on lg, stacked on mobile
 * - Uses getImageSource fallback helper
 */

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isExpandedDesc, setIsExpandedDesc] = useState(false);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId || "");

  const { userInfo } = useSelector((state) => state.auth || {});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const { data: topProducts } = useGetTopProductsQuery();
  const { data: myOrders } = useGetMyOrdersQuery(undefined, { skip: !userInfo });

  const hasPurchased = useMemo(() => {
    if (!userInfo || !myOrders || !product) return false;
    return myOrders.some(order => 
      order.isPaid && order.orderItems.some(item => item.product === product._id || item.product._id === product._id)
    );
  }, [userInfo, myOrders, product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review created successfully");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || err.message || "Review failed");
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty: Number(qty) }));
    navigate("/cart");
  };


  if (isLoading) return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-8 min-h-screen bg-transparent">
      <div className="max-w-[1200px] mx-auto animate-pulse">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1 lg:row-span-3 aspect-square sm:aspect-[4/5] bg-slate-200 dark:bg-slate-800/50 rounded-2xl"></div>
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <div className="h-12 w-48 bg-slate-200 dark:bg-slate-800/50 rounded-lg"></div>
            <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800/50 rounded-lg"></div>
            <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800/50 rounded-lg mt-4"></div>
            <div className="h-32 w-full bg-slate-100 dark:bg-slate-900/50 rounded-xl mt-8"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || error?.message || "Failed to load product"}
      </Message>
    );

  if (!product) return null;

  // safe timestamp: handle createAt OR createdAt
  const createdAt = product.createdAt || product.createAt || null;

  // related fallback (if your API provides related or sameBrand, plug it here)
  const related = product.related || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="w-full px-4 sm:px-6 lg:px-12 pt-4 pb-8"
    >
      <Helmet>
        <title>{product.name} | Luxury Store</title>
        <meta name="description" content={product.description.substring(0, 160)} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description.substring(0, 160)} />
        <meta property="og:image" content={getImageSource(product.image)} />
      </Helmet>
      
      <div className="max-w-[1200px] mx-auto">
        <Link to="/shop" className="group inline-flex items-center gap-2 text-slate-400 hover:text-emerald-500 font-semibold transition-all duration-300 mb-6 pb-2 border-b border-transparent hover:border-emerald-500/30 tracking-tight">
          <AiOutlineArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-6 lg:gap-8 items-start mt-2">
          {/* Image Gallery Column */}
          <div className="col-span-1 lg:row-span-3">
            <div className="rounded-xl lg:rounded-2xl p-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden group/hero aspect-square sm:aspect-[4/5] flex items-center justify-center relative">
              <img
                src={getImageSource(selectedImage || product.image)}
                alt={product.name}
                className="w-full h-full object-contain group-hover/hero:scale-[1.15] transition-transform duration-700 ease-out origin-center"
                loading="lazy"
              />
              <div className="absolute top-4 right-4 z-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-full shadow-sm">
                <HeartIcon product={product} />
              </div>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar">
                {/* Always include the main cover photo first */}
                {[product.image, ...product.images].map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg p-1 bg-white dark:bg-slate-900 overflow-hidden snap-start transition-all border-2 ${
                      (selectedImage || product.image) === imgUrl 
                        ? 'border-emerald-500 opacity-100 shadow-md scale-105' 
                        : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={getImageSource(imgUrl)} 
                      alt={`Thumbnail ${idx}`} 
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details (span 1 on mobile, 2 on lg) */}
          <div className="col-span-1 lg:col-span-2 lg:pl-8 flex flex-col pt-2 md:pt-4">
            {/* 1. Price + In Stock Badge */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-emerald-600 dark:text-emerald-400">
                ₹{product.price?.toLocaleString("en-IN")}
              </span>
              {product.countInStock > 0 ? (
                <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-bold rounded-full tracking-wider uppercase shadow-sm">
                  In Stock
                </span>
              ) : (
                <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 px-3 py-1 text-xs font-bold rounded-full tracking-wider uppercase shadow-sm">
                  Out of Stock
                </span>
              )}
            </div>

            {/* 2. Product Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-3">
              {product.name}
            </h1>

            {/* 3. Rating Just Below Name */}
            {(product.numReviews > 0 || product.rating > 0) && (
              <a href="#reviews" className="flex items-center gap-2 mb-6 text-sm hover:opacity-80 transition-opacity cursor-pointer group">
                <Ratings value={product.rating} />
                <span className="font-medium text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors underline decoration-transparent group-hover:decoration-emerald-500/50 underline-offset-4">
                  ({product.numReviews} review{product.numReviews !== 1 ? 's' : ''})
                </span>
              </a>
            )}

            {/* Action Buttons & Quantities Moved Here */}
            <div className="mb-6 flex flex-row items-center flex-wrap gap-4 sm:gap-6 bg-slate-50 dark:bg-slate-800/10 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              
              {/* Flex Counter Qty UI */}
              {product.countInStock > 0 && (
                <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6 bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 w-auto shrink-0 shadow-sm">
                  <button 
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                    className="p-1 text-slate-500 hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <AiOutlineMinus size={18} />
                  </button>
                  <span className="font-bold text-slate-800 dark:text-slate-100 w-6 text-center text-lg select-none">
                    {qty}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                    disabled={qty >= product.countInStock}
                    className="p-1 text-slate-500 hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase quantity"
                  >
                    <AiOutlinePlus size={18} />
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 w-full sm:w-auto sm:min-w-[300px]">
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="flex items-center justify-center gap-2 bg-transparent text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500/30 hover:border-emerald-500 disabled:opacity-50 px-2 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 whitespace-nowrap"
                >
                  <FaShoppingCart />
                  {product.countInStock === 0 ? "Depleted" : "Add to Cart"}
                </button>

                <button
                  onClick={() => {
                    addToCartHandler();
                    navigate("/shipping");
                  }}
                  disabled={product.countInStock === 0}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-2 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 border border-emerald-500 whitespace-nowrap"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* 4. Secondary Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 py-5 border-y border-slate-100 dark:border-slate-800/60 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-5 flex justify-center text-slate-400 dark:text-slate-500"><FaStore /></span>
                  <span>Brand:</span>{" "}
                  <Link to={`/shop?brand=${encodeURIComponent(product.brand)}`} className="text-emerald-600 dark:text-emerald-400 hover:underline hover:text-emerald-700 transition">
                    {product.brand}
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 flex justify-center text-slate-400 dark:text-slate-500"><FaClock /></span>
                  <span>Added:</span>{" "}
                  <span className="text-slate-700 dark:text-slate-300">{createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 flex justify-center text-slate-400 dark:text-slate-500"><FaBox /></span>
                  <span>Stock:</span>{" "}
                  <span className="text-slate-700 dark:text-slate-300 font-bold">{product.countInStock ?? 0} unit(s)</span>
                </div>
            </div>

            {/* Description */}
            <div className="mt-6 mb-8 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal opacity-90 max-w-[800px]">
              <p className={`overflow-hidden transition-all duration-300 ${isExpandedDesc ? '' : 'line-clamp-3'}`}>
                {product.description}
              </p>
              {product.description?.length > 150 && (
                <button 
                  onClick={() => setIsExpandedDesc(!isExpandedDesc)}
                  className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors tracking-wide underline decoration-2 underline-offset-4"
                >
                  {isExpandedDesc ? "Show Less" : "Read Full Info"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Related */}
        {topProducts && topProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-2xl font-serif font-extrabold text-slate-900 dark:text-slate-100 mb-8 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Suggested Additions
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {topProducts
                .filter((p) => p._id !== product._id)
                .slice(0, 8)
                .map((p) => (
                <SmallProduct key={p._id || p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div id="reviews" className="mt-16 pt-12 border-t border-slate-100 dark:border-slate-800 scroll-mt-24">
          <h3 className="text-2xl font-serif font-extrabold text-slate-900 dark:text-slate-100 mb-8 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Customer Reviews
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {!product.reviews || product.reviews.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400">No reviews yet.</p>
              ) : (
                product.reviews.map((review) => (
                  <article key={review._id} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                      <div>
                        <strong className="text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
                          {review.name}
                          {review.isVerifiedPurchase ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                              Verified Purchase
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 whitespace-nowrap">
                              Unverified
                            </span>
                          )}
                        </strong>
                        <time className="text-sm text-slate-500 dark:text-slate-400 mt-1 block">
                          {(review.createdAt || "").substring(0, 10)}
                        </time>
                      </div>
                      <Ratings value={review.rating} />
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {review.comment}
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="lg:col-span-1">
              {hasPurchased ? (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm sticky top-24">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Write a Review</h4>
                  <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                      <label htmlFor="rating" className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">Rating</label>
                      <select id="rating" required value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none">
                        <option value="">Select</option>
                        <option value={1}>1 - Inferior</option>
                        <option value={2}>2 - Decent</option>
                        <option value={3}>3 - Great</option>
                        <option value={4}>4 - Excellent</option>
                        <option value={5}>5 - Exceptional</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="comment" className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">Comment</label>
                      <textarea id="comment" rows="4" required value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <button type="submit" disabled={loadingProductReview} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-3 rounded-lg transition-colors shadow-lg shadow-emerald-600/20">
                      Submit Review
                    </button>
                  </form>
                </div>
              ) : userInfo ? (
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
                   <p className="text-slate-600 dark:text-slate-400 font-medium">Verified purchases only.</p>
                   <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">You need to have purchased this item to write a review.</p>
                 </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
                   <p className="text-slate-600 dark:text-slate-400">Please <Link to="/login" className="text-emerald-500 hover:underline">sign in</Link> to write a review.</p>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
