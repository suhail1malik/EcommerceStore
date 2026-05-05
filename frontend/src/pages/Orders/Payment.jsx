import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";
import { FaArrowRight } from "react-icons/fa";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart || {});
  const { shippingAddress = {}, paymentMethod: currentPaymentMethod } = cart;

  const [paymentMethod, setPaymentMethod] = useState(
    currentPaymentMethod || "Razorpay"
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress.address, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <ProgressSteps step1 step2 step3 />
        
        <form
          onSubmit={submitHandler}
          className="mt-8 sm:mt-12 w-full premium-card rounded-[24px] sm:rounded-[32px] p-6 sm:p-12"
          aria-label="Payment form"
        >
          <div className="mb-8 sm:mb-10 text-center sm:text-left">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 italic font-serif">
              Payment Gateway
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Select your preferred method of settlement.</p>
          </div>

          <fieldset className="mb-8 sm:mb-10">
            <legend className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 sm:mb-6 ml-1">
              Available Channels
            </legend>

            <div className="grid grid-cols-1 gap-4 sm:gap-5">
              <label className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 border-2 rounded-2xl sm:rounded-[24px] cursor-pointer transition-all duration-300 ${
                paymentMethod === "Razorpay" 
                  ? "border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/10 ring-4 ring-emerald-500/5" 
                  : "border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 hover:border-emerald-300 dark:hover:border-emerald-800"
              }`}>
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  paymentMethod === "Razorpay" ? "border-emerald-500 bg-emerald-500" : "border-slate-300 dark:border-slate-700"
                }`}>
                  {paymentMethod === "Razorpay" && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />}
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Razorpay"
                  checked={paymentMethod === "Razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="hidden"
                />
                <div className="flex-1">
                  <span className="block text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">Secure Digital Checkout</span>
                  <span className="block text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Razorpay: Cards, UPI, Net Banking</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 border-2 rounded-2xl sm:rounded-[24px] cursor-pointer transition-all duration-300 ${
                paymentMethod === "CashOnDelivery" 
                  ? "border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/10 ring-4 ring-emerald-500/5" 
                  : "border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 hover:border-emerald-300 dark:hover:border-emerald-800"
              }`}>
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  paymentMethod === "CashOnDelivery" ? "border-emerald-500 bg-emerald-500" : "border-slate-300 dark:border-slate-700"
                }`}>
                  {paymentMethod === "CashOnDelivery" && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />}
                </div>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="CashOnDelivery" 
                  checked={paymentMethod === "CashOnDelivery"} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                  className="hidden"
                />
                <div className="flex-1">
                  <span className="block text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">Fulfillment Settlement</span>
                  <span className="block text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Pay upon successful delivery</span>
                </div>
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 sm:py-5 px-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-3"
            aria-label="Continue to place order"
          >
            Review Order <FaArrowRight className="text-sm" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
