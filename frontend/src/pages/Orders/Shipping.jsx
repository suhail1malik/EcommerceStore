// src/pages/order/Shipping.jsx
import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { saveShippingAddress } from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

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
    <div className="container mx-auto mt-8 px-4">
      <ProgressSteps step1 step2 />
      <div className="mt-8 flex justify-center">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-md p-6"
          aria-label="Shipping form"
        >
          <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-slate-100">
            Shipping
          </h1>

          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-gray-700 dark:text-slate-200 mb-2"
            >
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter address"
              value={address}
              required
              autoComplete="street-address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="city"
                className="block text-gray-700 dark:text-slate-200 mb-2"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter city"
                value={city}
                required
                autoComplete="address-level2"
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="postalCode"
                className="block text-gray-700 dark:text-slate-200 mb-2"
              >
                Postal Code
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter postal code"
                value={postalCode}
                required
                autoComplete="postal-code"
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="country"
              className="block text-gray-700 dark:text-slate-200 mb-2"
            >
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter country"
              value={country}
              required
              autoComplete="country"
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-full text-lg mt-4"
            aria-label="Continue to payment"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
