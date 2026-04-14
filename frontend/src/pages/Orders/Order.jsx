// src/pages/order/Order.jsx
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { generateInvoicePDF } from "../../utils/invoiceGenerator";

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import RazorpayPayment from "../../components/RazorpayPayment";
import OrderStepper from "../../components/OrderStepper";

import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useCancelOrderMutation,
  useMarkAsPackedMutation,
  useMarkAsShippedMutation,
  useMarkAsOutForDeliveryMutation,
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
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [cancelOrder, { isLoading: loadingCancel }] = useCancelOrderMutation();

  const [markAsPacked, { isLoading: loadingPacked }] = useMarkAsPackedMutation();
  const [markAsShipped, { isLoading: loadingShipped }] = useMarkAsShippedMutation();
  const [markAsOutForDelivery, { isLoading: loadingOutForDelivery }] = useMarkAsOutForDeliveryMutation();

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

  const generateInvoice = () => {
    generateInvoicePDF(order);
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

  const packHandler = async () => {
    try {
      await markAsPacked(orderId).unwrap();
      await refetch();
      toast.success("Order marked as packed.");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to mark packed.");
    }
  };

  const shipHandler = async () => {
    try {
      await markAsShipped(orderId).unwrap();
      await refetch();
      toast.success("Order marked as shipped.");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to mark shipped.");
    }
  };

  const outForDeliveryHandler = async () => {
    try {
      await markAsOutForDelivery(orderId).unwrap();
      await refetch();
      toast.success("Order marked as out for delivery.");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to mark out for delivery.");
    }
  };

  const cancelOrderHandler = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await cancelOrder(orderId).unwrap();
        await refetch();
        toast.success("Order cancelled successfully.");
      } catch (err) {
        toast.error(
          err?.data?.message || err?.message || "Failed to cancel order."
        );
        console.error("cancelOrder error:", err);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Visual Tracking Stepper */}
      <div className="mb-8 bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 gap-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">Order Tracking</h2>
          {order?.estimatedDeliveryDate && (
             <p className="text-sm text-gray-600 dark:text-gray-300">
               Est. Delivery: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</span>
             </p>
          )}
        </div>
        <div className="mt-2">
          <OrderStepper order={order} />
        </div>
      </div>

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
                          className="text-lg font-medium text-emerald-600 dark:text-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors"
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
                      <span className="font-medium break-words text-slate-800 dark:text-slate-100 font-mono tracking-wider">
                        ORD-{order._id.substring(18).toUpperCase()}
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
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(order?.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Invoice Download Button (Available for Admin or the buyer) */}
              <div className="mb-6">
                <button
                  onClick={generateInvoice}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-300 dark:border-slate-600 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Preview Invoice (PDF)
                </button>
              </div>

              {!order?.isPaid && !order?.isCancelled && (
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

              {userInfo?.isAdmin && !order?.isDelivered && !order?.isCancelled && (
                <div className="mt-6 space-y-3">
                  {/* Admin controls logic */}
                  {(!order.isPaid && order.paymentMethod !== "CashOnDelivery") ? (
                    <div className="text-emerald-600 dark:text-emerald-400 font-medium text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      Awaiting Payment before processing.
                    </div>
                  ) : !order.isPacked ? (
                    <button
                      type="button"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
                      onClick={packHandler}
                      disabled={loadingPacked}
                    >
                      {loadingPacked ? <Loader /> : "Mark As Packed"}
                    </button>
                  ) : !order.isShipped ? (
                    <button
                      type="button"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
                      onClick={shipHandler}
                      disabled={loadingShipped}
                    >
                      {loadingShipped ? <Loader /> : "Mark As Shipped"}
                    </button>
                  ) : !order.isOutForDelivery ? (
                    <button
                      type="button"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
                      onClick={outForDeliveryHandler}
                      disabled={loadingOutForDelivery}
                    >
                      {loadingOutForDelivery ? <Loader /> : "Mark As Out For Delivery"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
                      onClick={deliverHandler}
                      disabled={loadingDeliver}
                    >
                      {loadingDeliver ? <Loader /> : "Mark As Delivered"}
                    </button>
                  )}
                </div>
              )}

              {!order?.isCancelled && !order?.isDelivered && !order?.isShipped && (
                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium py-3 px-4 rounded-lg transition-colors duration-300"
                    onClick={cancelOrderHandler}
                    disabled={loadingCancel}
                  >
                    {loadingCancel ? <Loader /> : "Cancel Order"}
                  </button>
                </div>
              )}
              {order?.isCancelled && (
                <div className="mt-6 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-center font-medium">
                  Order Cancelled
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
