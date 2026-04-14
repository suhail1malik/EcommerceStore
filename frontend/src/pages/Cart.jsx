import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaArrowRight, FaLock } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import getImageSource from "../utils/images";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  
  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = useMemo(() => {
    const itemsPrice = cartItems.reduce(
      (acc, item) => acc + (item.price || 0) * (item.qty || 0),
      0
    );
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = 0.15 * itemsPrice;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
  }, [cartItems]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full px-4 sm:px-6 lg:px-12 py-10 min-h-[70vh]"
    >
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl lg:text-5xl font-extrabold mb-2 font-serif tracking-tight text-gray-900 dark:text-slate-100" style={{ fontFamily: "'Playfair Display', serif" }}>
          Your Shopping Bag
        </h1>
        <p className="text-slate-500 mb-10 pb-4 border-b border-gray-200 dark:border-slate-800">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} ready for checkout
        </p>

        {cartItems.length === 0 ? (
          <div className="max-w-3xl mx-auto text-center py-20 bg-gray-50 dark:bg-slate-800/40 rounded-[32px] border border-gray-100 dark:border-slate-700/50">
            <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full mx-auto flex items-center justify-center text-5xl mb-6 shadow-sm">
              🛍️
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-slate-100">Your bag is empty</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your bag yet. Explore our curated selection of premium aesthetic pieces.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold tracking-widest uppercase text-sm shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95"
            >
              Explore Catalog <FaArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT COLUMN - ITEMS */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0, overflow: "hidden" }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 p-4 sm:p-6 border-2 border-slate-100 dark:border-slate-800/50 rounded-[24px] bg-white dark:bg-slate-800/80 shadow-sm hover:shadow-md transition-shadow group"
                  >
                    {/* IMAGE */}
                    <Link to={`/product/${item._id}`} className="flex-shrink-0 relative overflow-hidden rounded-2xl w-32 h-32 sm:w-40 sm:h-40 bg-slate-50 dark:bg-slate-900">
                      <img
                        src={getImageSource(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </Link>

                    {/* PRODUCT INFO */}
                    <div className="flex-1 flex flex-col justify-between w-full py-2">
                      <div className="flex justify-between items-start gap-4 text-center sm:text-left">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                            {item.brand}
                          </p>
                          <Link
                            to={`/product/${item._id}`}
                            className="text-xl font-bold text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                        </div>
                        <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100 shrink-0">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-6 sm:mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                        {/* QUANTITY CONTROLS */}
                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <button
                            onClick={() => addToCartHandler(item, Math.max(0, item.qty - 1))}
                            className="w-8 h-8 rounded flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-bold text-slate-900 dark:text-white">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => addToCartHandler(item, item.qty + 1)}
                            className="w-8 h-8 rounded flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        {/* REMOVE BUTTON */}
                        <button
                          onClick={() => removeFromCartHandler(item._id)}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <FaTrash className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* RIGHT COLUMN - ORDER SUMMARY */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-100 dark:border-slate-800/50 rounded-[32px] p-8 sticky top-24 shadow-xl">
                <h2 className="text-2xl font-extrabold mb-6 text-gray-900 dark:text-slate-100">Order Summary</h2>

                <div className="space-y-4 mb-8 text-slate-600 dark:text-slate-300 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-gray-900 dark:text-white font-semibold">₹{itemsPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold">
                      {shippingPrice === 0 ? (
                        <span className="text-emerald-500">Free</span>
                      ) : (
                        `₹${shippingPrice.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span className="text-gray-900 dark:text-white font-semibold">₹{taxPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <hr className="border-slate-200 dark:border-slate-700 my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-slate-100">Total</span>
                    <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-500">
                      ₹{totalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => navigate("/shipping")}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-gray-900 dark:bg-emerald-600 text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-gray-800 dark:hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95 shadow-xl"
                  >
                    <FaLock /> Check Out
                  </button>

                  <Link
                    to="/shop"
                    className="flex justify-center w-full py-4 text-sm font-bold tracking-widest uppercase text-slate-500 hover:text-emerald-600 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Cart;
