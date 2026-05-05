import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose, AiOutlineShoppingCart } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, setImmediateCheckoutItem } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { getImageSource } from "../../utils/images";

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = React.useState(null);

  React.useEffect(() => {
    if (product) setSelectedImage(product.image);
  }, [product, isOpen]);

  if (!product) return null;

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success(`${product.name} added to cart`);
    onClose();
  };

  const buyNowHandler = () => {
    dispatch(setImmediateCheckoutItem({ ...product, qty: 1 }));
    onClose();
    navigate("/shipping");
  };

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border border-white/10"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-500 transition-colors shadow-sm"
            >
              <AiOutlineClose size={24} />
            </button>

            <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto hide-scrollbar">
              {/* Image Section */}
              <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-800/30 flex flex-col items-center justify-center p-6 border-r border-slate-100 dark:border-slate-800/50">
                <div className="w-full flex-1 flex items-center justify-center min-h-[300px]">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={getImageSource(selectedImage || product.image)}
                    alt={product.name}
                    className="max-w-full max-h-[350px] object-contain drop-shadow-2xl"
                  />
                </div>
                
                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar w-full justify-center">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`w-12 h-12 rounded-lg border-2 overflow-hidden shrink-0 transition-all ${
                          selectedImage === img ? "border-emerald-500 scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={getImageSource(img)} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
                <div className="mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                    {product.brand}
                  </span>
                </div>

                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1 text-amber-500">
                    <FaStar />
                    <span className="font-bold text-slate-900 dark:text-white">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-slate-400 dark:text-slate-500">|</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {product.numReviews} Reviews
                  </span>
                </div>

                <div className="mb-8">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4">
                    {product.description}
                  </p>
                  <Link
                    to={`/product/${product._id}`}
                    onClick={onClose}
                    className="inline-block mt-2 text-sm font-bold text-emerald-500 hover:underline"
                  >
                    View Full Details →
                  </Link>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                      product.countInStock > 0 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                    }`}>
                      {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={addToCartHandler}
                      disabled={product.countInStock === 0}
                      className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold hover:border-emerald-500 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <AiOutlineShoppingCart size={20} />
                      Add to Cart
                    </button>
                    <button
                      onClick={buyNowHandler}
                      disabled={product.countInStock === 0}
                      className="px-6 py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default QuickViewModal;
