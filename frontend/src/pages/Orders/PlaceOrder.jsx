// src/pages/order/PlaceOrder.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import RazorpayPayment from "../../components/RazorpayPayment";
import { FaArrowRight, FaCreditCard, FaShippingFast, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems, removeFromCart, clearImmediateCheckout } from "../../redux/features/cart/cartSlice";
import { BASE_URL } from "../../redux/constants";

// helper: safe currency formatter for INR
const formatINR = (value) => {
  if (value == null || Number.isNaN(Number(value))) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(value));
};

const getImageSource = (imagePath) => {
  if (!imagePath)
    return "https://via.placeholder.com/64x64/374151/9ca3af?text=No+Image";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/")) return `${BASE_URL}${imagePath}`;
  return `${BASE_URL}/uploads/${imagePath}`;
};

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart || {});
  const { cartItems, shippingAddress, paymentMethod, immediateCheckoutItem } = cart;

  // Determine which items to display and calculate totals for
  const displayItems = immediateCheckoutItem ? [immediateCheckoutItem] : (cartItems || []);
  
  // Calculate dynamic totals for the display items (since cart totals in state are for cartItems only)
  const calculateDisplayTotals = () => {
    if (immediateCheckoutItem) {
      const itemsPrice = immediateCheckoutItem.price * immediateCheckoutItem.qty;
      const shippingPrice = itemsPrice > 100 ? 0 : 10;
      const taxPrice = (itemsPrice * (immediateCheckoutItem.category?.taxPercentage || immediateCheckoutItem.taxPercentage || 10) / 100);
      const totalPrice = itemsPrice + shippingPrice + taxPrice;
      
      return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
      };
    }
    return {
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    };
  };

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateDisplayTotals();

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    // redirect to shipping if no shipping address
    if (!shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [shippingAddress?.address, navigate]);

  const placeOrderHandler = async (paymentResult = null) => {
    if (displayItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      const orderPayload = {
        orderItems: displayItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      if (paymentResult) {
        orderPayload.isPaid = true;
        orderPayload.paidAt = new Date().toISOString();
        orderPayload.paymentResult = {
          id: paymentResult.razorpay_payment_id,
          status: "completed",
          update_time: new Date().toISOString(),
          razorpay_order_id: paymentResult.razorpay_order_id,
          razorpay_signature: paymentResult.razorpay_signature,
        };
      }

      const res = await createOrder(orderPayload).unwrap();

      // clear cart if it was a cart order, or just clear immediate checkout
      if (immediateCheckoutItem) {
        dispatch(clearImmediateCheckout());
      } else {
        dispatch(clearCartItems());
      }
      
      toast.success("Order placed successfully! Redirecting...");
      
      setTimeout(() => {
        navigate("/my-orders");
      }, 3000);
    } catch (err) {
      const msg = err?.data?.message || err?.message || "Failed to place order";
      
      // Auto-sync Cart: If a product was deleted by admin but still in user's cart
      if (msg.startsWith("Product not found:")) {
        const missingId = msg.split("Product not found:")[1]?.trim();
        if (missingId) {
          dispatch(removeFromCart(missingId));
          toast.error("An item in your cart is no longer available and has been automatically removed. Please review your cart.");
          return;
        }
      }

      toast.error(msg);
    }
  };  return (
    <div className="container mx-auto px-4 py-6 sm:py-10 min-h-screen">
      <ProgressSteps step1 step2 step3 step4 />
      <div className="mt-8 sm:mt-12">
        {displayItems.length === 0 ? (
          <div className="premium-card rounded-[24px] sm:rounded-[32px] p-10 sm:p-20 text-center max-w-3xl mx-auto">
             <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-slate-800 rounded-full mx-auto flex items-center justify-center text-4xl sm:text-5xl mb-6 shadow-sm">
                🛍️
              </div>
            <Message>Your cart is currently empty</Message>
            <div className="mt-10">
              <Link
                to="/shop"
                className="px-8 py-4 bg-emerald-600 text-white font-bold uppercase tracking-widest text-xs sm:text-sm rounded-xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
              >
                Go to Collections
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
            {/* Left Column - Detailed Breakdown */}
            <div className="lg:col-span-8 order-2 lg:order-1 space-y-6 sm:space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card rounded-[24px] sm:rounded-[32px] overflow-hidden"
              >
                <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <FaShippingFast className="text-emerald-500" /> Manifest Lineup
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {immediateCheckoutItem ? "Immediate Purchase" : `${displayItems.length} items`}
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {displayItems.map((item, index) => (
                    <div key={index} className="p-4 sm:p-8 flex items-center gap-4 sm:gap-8 group relative">
                      {/* Remove Item Button - only for cart items */}
                      {!immediateCheckoutItem && (
                        <button 
                          onClick={() => dispatch(removeFromCart(item._id))}
                          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Remove Item"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}

                      <div className="flex-shrink-0 relative overflow-hidden rounded-xl sm:rounded-2xl w-16 h-16 sm:w-28 sm:h-28 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50">
                        <img
                          src={getImageSource(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-0.5">{item.brand}</p>
                        <Link
                          to={`/product/${item.product || item._id}`}
                          className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white hover:text-emerald-600 transition-colors truncate block pr-8"
                        >
                          {item.name}
                        </Link>
                        <div className="mt-1 sm:mt-3 flex items-center gap-4 sm:gap-6">
                           <div className="text-left">
                             <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty</p>
                             <p className="text-xs sm:text-base font-extrabold text-slate-900 dark:text-slate-100">{item.qty}</p>
                           </div>
                           <div className="text-left">
                             <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Row Total</p>
                             <p className="text-xs sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">{formatINR(item.qty * item.price)}</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Delivery Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1 }}
                   className="premium-card rounded-[24px] sm:rounded-[32px] p-6 sm:p-8"
                 >
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <FaShippingFast size={16} />
                      </div>
                      Logistics Node
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                       <div>
                         <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Destination Address</p>
                         <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium">
                           {shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}
                         </p>
                       </div>
                       <Link to="/shipping" className="inline-block text-[10px] sm:text-xs font-bold text-emerald-500 hover:underline uppercase tracking-widest">Modify Terminal »</Link>
                    </div>
                 </motion.div>

                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                   className="premium-card rounded-[24px] sm:rounded-[32px] p-6 sm:p-8"
                 >
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <FaCreditCard size={16} />
                      </div>
                      Settlement Logic
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                       <div>
                         <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Method</p>
                         <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-bold">
                           {paymentMethod === "Razorpay" ? "Secure Digital Gateway" : "Fulfillment Settlement (COD)"}
                         </p>
                       </div>
                       <Link to="/payment" className="inline-block text-[10px] sm:text-xs font-bold text-emerald-500 hover:underline uppercase tracking-widest">Switch Protocol »</Link>
                    </div>
                 </motion.div>
              </div>
            </div>

            {/* Right Column - Fiscal Summary */}
            <div className="lg:col-span-4 order-1 lg:order-2">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="premium-card rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 sticky top-24 shadow-2xl border-emerald-500/10"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-slate-900 dark:text-white">Fiscal Summary</h2>
                <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  <div className="flex justify-between">
                    <span>Gross Inventory</span>
                    <span className="text-slate-900 dark:text-white font-bold">{formatINR(itemsPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Logistics Fee</span>
                    <span className="text-slate-900 dark:text-white font-bold">{formatINR(shippingPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Levies</span>
                    <span className="text-slate-900 dark:text-white font-bold">{formatINR(taxPrice)}</span>
                  </div>
                  <div className="pt-4 sm:pt-5 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Total Valuation</span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 drop-shadow-sm">
                        {formatINR(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <Message variant="danger" className="mb-6">
                    {error?.data?.message || error?.message || "Protocol mismatch detected."}
                  </Message>
                )}

                <div className="space-y-4">
                  {paymentMethod === "Razorpay" ? (
                    <RazorpayPayment
                      amount={totalPrice}
                      orderId="new_order"
                      onSuccess={async (paymentResult) => {
                        await placeOrderHandler(paymentResult);
                      }}
                      onFailure={(err) => {
                        toast.error(err || "Transaction failed.");
                      }}
                      disabled={displayItems.length === 0 || isLoading}
                    />
                  ) : (
                    <button
                      type="button"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-4 sm:py-5 rounded-xl sm:rounded-2xl transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] sm:text-xs"
                      disabled={displayItems.length === 0 || isLoading}
                      onClick={() => placeOrderHandler(null)}
                    >
                      {isLoading ? (
                        <>
                          <Loader />
                          <span className="ml-2">Processing...</span>
                        </>
                      ) : (
                        <>Complete Order <FaCheckCircle className="text-sm" /></>
                      )}
                    </button>
                  )}
                  <p className="text-[9px] sm:text-[10px] text-center text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest px-4">
                    By confirming, you agree to our terms.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceOrder;
