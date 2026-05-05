// src/pages/order/Shipping.jsx
import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { saveShippingAddress } from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";
import { FaArrowRight } from "react-icons/fa";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart || {});
  const { shippingAddress = {} } = cart;


  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const submitHandler = useCallback(
    (e) => {
      e.preventDefault();

      // simple validation
      if (!address || !city || !postalCode || !country) {
        // you can replace with toast if you prefer
        alert("Please fill in all fields.");
        return;
      }

      dispatch(saveShippingAddress({ address, city, postalCode, country }));
      navigate("/payment");
    },
    [address, city, postalCode, country, dispatch, navigate]
  );

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <ProgressSteps step1 step2 />
        
        <form
          onSubmit={submitHandler}
          className="mt-8 sm:mt-12 w-full premium-card rounded-[24px] sm:rounded-[32px] p-6 sm:p-12"
          aria-label="Shipping form"
        >
          <div className="mb-8 sm:mb-10 text-center sm:text-left">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 italic font-serif">
              Shipping Destination
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Where should we deliver your luxury pieces?</p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div>
              <label
                htmlFor="address"
                className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 sm:mb-3 ml-1"
              >
                Street Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className="w-full px-4 sm:px-5 py-3.5 sm:py-4 border-2 border-slate-200 dark:border-slate-700/50 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                placeholder="123 Luxury Lane"
                value={address}
                required
                autoComplete="street-address"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <label
                  htmlFor="city"
                  className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 sm:mb-3 ml-1"
                >
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 border-2 border-slate-200 dark:border-slate-700/50 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Design District"
                  value={city}
                  required
                  autoComplete="address-level2"
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 sm:mb-3 ml-1"
                >
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 border-2 border-slate-200 dark:border-slate-700/50 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                  placeholder="000000"
                  value={postalCode}
                  required
                  autoComplete="postal-code"
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 sm:mb-3 ml-1"
              >
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                className="w-full px-4 sm:px-5 py-3.5 sm:py-4 border-2 border-slate-200 dark:border-slate-700/50 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                placeholder="India"
                value={country}
                required
                autoComplete="country"
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 sm:py-5 px-4 rounded-xl sm:rounded-2xl text-base sm:text-lg mt-8 sm:mt-12 font-bold uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-3"
            aria-label="Continue to payment"
          >
            Continue <FaArrowRight className="text-sm" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
