// src/pages/order/Order.jsx
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import RazorpayPayment from "../../components/RazorpayPayment";

import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import { BASE_URL } from "../../redux/constants";

const formatCurrency = (value) => {
  if (value == null || Number.isNaN(Number(value))) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(value));
};

const getImageSource = (imagePath) => {
  if (!imagePath) {
    return "https://via.placeholder.com/80x80/374151/9ca3af?text=No+Image";
  }
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/")) return `${BASE_URL}${imagePath}`;
  return `${BASE_URL}/${imagePath}`;
};

const Order = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth || {});

  // Early returns for loading / error
  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || error?.message || "Failed to load order."}
      </Message>
    );
  if (!order) return <Message>Order not found.</Message>;

  // Handlers
  const handleRazorpaySuccess = async (paymentResponse) => {
    try {
      await payOrder({
        orderId: paymentResponse.dbOrderId || orderId,
        details: {
          paymentId: paymentResponse.razorpay_payment_id,
          orderId: paymentResponse.razorpay_order_id,
          signature: paymentResponse.razorpay_signature,
        },
      }).unwrap();
      await refetch();
      toast.success("Order is paid successfully!");
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || "Payment confirmation failed."
      );
      console.error("payOrder error:", err);
    }
  };

  const handleRazorpayFailure = (err) => {
    toast.error("Payment failed. Please try again.");
    console.error("Payment error:", err);
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      await refetch();
      toast.success("Order marked as delivered.");
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || "Failed to mark delivered."
      );
      console.error("deliverOrder error:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Items + Shipping */}
        <div className="lg:w-2/3 space-y-6">
          {/* Order Items */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
                Order Items
              </h2>
            </div>
            <div className="p-6">
              {order?.orderItems?.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"
                    >
                      <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                        <img
                          src={getImageSource(item.image)}
                          alt={item.name || `item-${index}`}
                          className="w-20 h-20 object-cover rounded-lg"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/80x80/374151/9ca3af?text=No+Image";
                          }}
                        />
                      </div>

                      <div className="flex-grow text-center sm:text-left">
                        <Link
                          to={`/product/${item.product}`}
                          className="text-lg font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          {item.name}
                        </Link>

                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500 dark:text-slate-300">
                              Quantity
                            </p>
                            <p className="font-medium">{item.qty}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-slate-300">
                              Unit Price
                            </p>
                            <p className="font-medium">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-slate-300">
                              Total
                            </p>
                            <p className="font-medium">
                              {formatCurrency(item.qty * item.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
                Shipping Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-slate-100 mb-4">
                    Order Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex">
                      <span className="text-gray-600 dark:text-slate-300 w-32">
                        Order ID:
                      </span>
                      <span className="font-medium break-words">
                        {order._id}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 dark:text-slate-300 w-32">
                        Name:
                      </span>
                      <span className="font-medium">
                        {order?.user?.username || order?.user?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 dark:text-slate-300 w-32">
                        Email:
                      </span>
                      <span className="font-medium">
                        {order?.user?.email || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-slate-100 mb-4">
                    Shipping Address
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex">
                      <span className="text-gray-600 dark:text-slate-300 w-32">
                        Address:
                      </span>
                      <span className="font-medium">
                        {order?.shippingAddress?.address || "N/A"},{" "}
                        {order?.shippingAddress?.city || ""}{" "}
                        {order?.shippingAddress?.postalCode || ""},{" "}
                        {order?.shippingAddress?.country || ""}
                      </span>
                    </div>

                    <div className="flex">
                      <span className="text-gray-600 dark:text-slate-300 w-32">
                        Payment Method:
                      </span>
                      <span className="font-medium">
                        {order?.paymentMethod || "N/A"}
                      </span>
                    </div>

                    <div className="flex">
                      <span className="text-gray-600 dark:text-slate-300 w-32">
                        Payment Status:
                      </span>
                      <span className="font-medium">
                        {order?.isPaid ? (
                          <span className="text-green-600 dark:text-green-300">
                            Paid on{" "}
                            {order?.paidAt
                              ? new Date(order.paidAt).toLocaleDateString()
                              : "N/A"}
                          </span>
                        ) : (
                          <span className="text-red-600 dark:text-red-300">
                            Not paid
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Summary + Actions */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden sticky top-8">
            <div className="bg-gray-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
                Order Summary
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-300">
                    Items:
                  </span>
                  <span className="font-medium">
                    {formatCurrency(order?.itemsPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-300">
                    Shipping:
                  </span>
                  <span className="font-medium">
                    {formatCurrency(order?.shippingPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-300">
                    Tax:
                  </span>
                  <span className="font-medium">
                    {formatCurrency(order?.taxPrice)}
                  </span>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800 dark:text-slate-100">
                      Total:
                    </span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(order?.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {!order?.isPaid && (
                <div className="mb-6">
                  {loadingPay && <Loader />}
                  <RazorpayPayment
                    amount={order?.totalPrice}
                    orderId={order?._id}
                    onSuccess={handleRazorpaySuccess}
                    onFailure={handleRazorpayFailure}
                    disabled={loadingPay}
                  />
                </div>
              )}

              {loadingDeliver && <Loader />}

              {userInfo?.isAdmin && order?.isPaid && !order?.isDelivered && (
                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
                    onClick={deliverHandler}
                  >
                    Mark As Delivered
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
