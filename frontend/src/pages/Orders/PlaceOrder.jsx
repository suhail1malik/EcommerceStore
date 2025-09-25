// src/pages/order/PlaceOrder.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";

import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
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
  const cartItems = cart?.cartItems || [];
  const shippingAddress = cart?.shippingAddress || {};
  const paymentMethod = cart?.paymentMethod || "";

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    // redirect to shipping if no shipping address
    if (!shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [shippingAddress?.address, navigate]);

  const placeOrderHandler = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      // clear cart and navigate to order page
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      const msg = err?.data?.message || err?.message || "Failed to place order";
      toast.error(msg);
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />
      <div className="container mx-auto mt-8 px-4">
        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
            <Message>Your cart is empty</Message>
            <div className="mt-4">
              <Link
                to="/shop"
                className="text-indigo-600 dark:text-indigo-300 hover:underline"
              >
                Go to Shop
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden mb-8">
                <div className="bg-gray-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
                    Order Items
                  </h2>
                </div>
                <div className="divide-y">
                  {cartItems.map((item, index) => (
                    <div key={index} className="p-6 flex flex-col sm:flex-row">
                      <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                        <img
                          src={getImageSource(item.image)}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "https://via.placeholder.com/64x64/374151/9ca3af?text=No+Image";
                          }}
                        />
                      </div>
                      <div className="flex-grow">
                        <Link
                          to={`/product/${item.product}`}
                          className="text-lg font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-slate-300">
                              Quantity
                            </p>
                            <p className="font-medium">{item.qty}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-slate-300">
                              Price
                            </p>
                            <p className="font-medium">
                              {formatINR(item.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm text-gray-500 dark:text-slate-300">
                          Total
                        </p>
                        <p className="text-lg font-semibold">
                          {formatINR(item.qty * item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden sticky top-8">
                <div className="bg-gray-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
                    Order Summary
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-slate-300">
                        Items:
                      </span>
                      <span className="font-medium">
                        {formatINR(cart.itemsPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-slate-300">
                        Shipping:
                      </span>
                      <span className="font-medium">
                        {formatINR(cart.shippingPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-slate-300">
                        Tax:
                      </span>
                      <span className="font-medium">
                        {formatINR(cart.taxPrice)}
                      </span>
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-800 dark:text-slate-100">
                          Total:
                        </span>
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {formatINR(cart.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <Message variant="danger" className="mb-4">
                      {error?.data?.message ||
                        error?.message ||
                        JSON.stringify(error)}
                    </Message>
                  )}

                  <button
                    type="button"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                    disabled={cartItems.length === 0 || isLoading}
                    onClick={placeOrderHandler}
                  >
                    {isLoading ? (
                      <>
                        <Loader />
                        <span className="ml-2">Processing...</span>
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </button>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden mt-6">
                <div className="bg-gray-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
                    Shipping Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-slate-100 mb-2">
                      Shipping Address
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300">
                      {shippingAddress.address || "N/A"},{" "}
                      {shippingAddress.city || ""}{" "}
                      {shippingAddress.postalCode || ""},{" "}
                      {shippingAddress.country || ""}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-slate-100 mb-2">
                      Payment Method
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300">
                      {paymentMethod || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlaceOrder;
