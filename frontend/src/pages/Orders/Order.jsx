// src/pages/order/Order.jsx
import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { generateInvoicePDF } from "../../utils/invoiceGenerator";

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import RazorpayPayment from "../../components/RazorpayPayment";
import OrderTimeline from "../../components/OrderTimeline";

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
  const navigate = useNavigate();
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
      toast.success("Order is paid successfully! Redirecting...");
      
      setTimeout(() => {
        navigate("/my-orders");
      }, 3000);
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

  return (    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Visual Tracking Stepper */}
      <div className="mb-8 premium-card rounded-[32px] p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 italic font-serif">Logistics Progress</h2>
          {order?.estimatedDeliveryDate && (
             <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
               Arrival Window: <span className="text-emerald-500">{new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</span>
             </p>
          )}
        </div>
        <div className="mt-2">
          <OrderTimeline 
            isPaid={order.isPaid}
            isPacked={order.isPacked}
            isShipped={order.isShipped}
            isOutForDelivery={order.isOutForDelivery}
            isDelivered={order.isDelivered}
            isCancelled={order.isCancelled}
            paidAt={order.paidAt}
            packedAt={order.packedAt}
            shippedAt={order.shippedAt}
            outForDeliveryAt={order.outForDeliveryAt}
            deliveredAt={order.deliveredAt}
            createdAt={order.createdAt}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Column - Items + Shipping */}
        <div className="lg:w-2/3 space-y-10">
          {/* Order Items */}
          <div className="premium-card rounded-[32px] overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white italic font-serif">
                Manifest Details
              </h2>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{order?.orderItems?.length} Units</span>
            </div>
            <div className="p-0">
              {order?.orderItems?.length === 0 ? (
                <div className="p-10 text-center"><Message>Order is empty</Message></div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-center p-8 gap-8 group"
                    >
                      <div className="flex-shrink-0 relative overflow-hidden rounded-2xl w-24 h-24 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50">
                        <img
                          src={getImageSource(item.image)}
                          alt={item.name || `item-${index}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>

                      <div className="flex-grow text-center sm:text-left">
                        <Link
                          to={`/product/${item.product}`}
                          className="text-base font-bold text-slate-900 dark:text-white hover:text-emerald-600 transition-colors"
                        >
                          {item.name}
                        </Link>

                        <div className="mt-4 flex items-center justify-center sm:justify-start gap-8">
                           <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty</p>
                             <p className="font-extrabold text-slate-900 dark:text-slate-100">{item.qty}</p>
                           </div>
                           <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Val</p>
                             <p className="font-extrabold text-slate-900 dark:text-slate-100">{formatCurrency(item.price)}</p>
                           </div>
                           <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Row</p>
                             <p className="font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(item.qty * item.price)}</p>
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
          <div className="premium-card rounded-[32px] overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white italic font-serif">
                Logistics & Identity
              </h2>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Recipient Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Terminal ID</p>
                      <p className="font-bold text-slate-900 dark:text-white font-mono">ORD-{order._id.substring(18).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Authenticated Entity</p>
                      <p className="font-bold text-slate-900 dark:text-white">{order?.user?.username || order?.user?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Protocol</p>
                      <p className="font-bold text-slate-900 dark:text-white">{order?.user?.email || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Destination Hub</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Physical Address</p>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {order?.shippingAddress?.address || "N/A"},{" "}
                        {order?.shippingAddress?.city || ""}{" "}
                        {order?.shippingAddress?.postalCode || ""},{" "}
                        {order?.shippingAddress?.country || ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Settlement Method</p>
                      <p className="font-bold text-slate-900 dark:text-white">{order?.paymentMethod || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Financial State</p>
                      {order?.isPaid ? (
                        <p className="font-bold text-emerald-500">
                          Cleared on {new Date(order.paidAt).toLocaleDateString()}
                        </p>
                      ) : (
                        <p className="font-bold text-red-500">Awaiting Settlement</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Summary + Actions */}
        <div className="lg:w-1/3">
          <div className="premium-card rounded-[32px] overflow-hidden sticky top-8 shadow-2xl">
            <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white italic font-serif">
                Fiscal Snapshot
              </h2>
            </div>

            <div className="p-8">
              <div className="space-y-5 mb-8 text-slate-600 dark:text-slate-400 font-medium">
                <div className="flex justify-between">
                  <span>Gross Inventory</span>
                  <span className="text-slate-900 dark:text-white font-bold">{formatCurrency(order?.itemsPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Logistics Fee</span>
                  <span className="text-slate-900 dark:text-white font-bold">{formatCurrency(order?.shippingPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Levies</span>
                  <span className="text-slate-900 dark:text-white font-bold">{formatCurrency(order?.taxPrice)}</span>
                </div>

                <div className="pt-5 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-slate-900 dark:text-white">Total Valuation</span>
                    <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(order?.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Invoice Download Button */}
              <div className="mb-6">
                <button
                  onClick={generateInvoice}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Generate Invoice PDF
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
