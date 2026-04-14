import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

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
    <div className="container mx-auto mt-8 px-4">
      <ProgressSteps step1 step2 step3 />
      <div className="mt-8 flex justify-center">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-md p-6"
          aria-label="Payment form"
        >
          <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-slate-100">
            Payment Method
          </h1>

          <fieldset className="mb-6">
            <legend className="text-gray-700 dark:text-slate-200 mb-4 font-medium">
              Select Payment Method
            </legend>

            <div className="flex flex-col space-y-4 pt-2">
              <label className="inline-flex items-center text-gray-800 dark:text-slate-100 p-4 border border-slate-200 dark:border-slate-700 rounded cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Razorpay"
                  checked={paymentMethod === "Razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio text-emerald-600 dark:text-emerald-500 focus:ring-emerald-500 h-5 w-5"
                  aria-checked={paymentMethod === "Razorpay"}
                />
                <span className="ml-3 font-medium">Razorpay (UPI, Cards, Net Banking)</span>
              </label>

              <label className="inline-flex items-center text-gray-800 dark:text-slate-100 p-4 border border-slate-200 dark:border-slate-700 rounded cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="CashOnDelivery" 
                  checked={paymentMethod === "CashOnDelivery"} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                  className="form-radio text-emerald-600 dark:text-emerald-500 focus:ring-emerald-500 h-5 w-5"
                  aria-checked={paymentMethod === "CashOnDelivery"} 
                />
                <span className="ml-3 font-medium">Cash on Delivery (Pay when your order arrives)</span>
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-full text-lg mt-4 font-medium transition"
            aria-label="Continue to place order"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
