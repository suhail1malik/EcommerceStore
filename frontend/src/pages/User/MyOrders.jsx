import React from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import OrderTimeline from "../../components/OrderTimeline";
import { BASE_URL } from "../../redux/constants";

const formatCurrency = (value) => {
  if (value == null || Number.isNaN(Number(value))) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(value));
};

const formatDate = (iso) => {
  if (!iso) return "N/A";
  try {
    return new Date(iso).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso.substring(0, 10);
  }
};

const getImageSource = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/120?text=No+Image";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/")) return `${BASE_URL}${imagePath}`;
  return `${BASE_URL}/${imagePath}`;
};

const MyOrders = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const navigate = useNavigate();

  if (isLoading) return (
    <div className="space-y-6">
      {[1, 2, 3].map(n => (
        <div key={n} className="h-40 w-full bg-slate-100 dark:bg-slate-800/50 rounded-[24px] animate-pulse" />
      ))}
    </div>
  );

  if (error)
    return (
      <Message variant="error">
        {error?.data?.message || error?.message || "Failed to load orders"}
      </Message>
    );

  if (!orders || orders.length === 0) {
    return (
      <div className="premium-card rounded-[32px] p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
        <div className="mb-6">
          <div className="mx-auto bg-emerald-500/10 rounded-full w-24 h-24 mb-4 flex items-center justify-center border border-emerald-500/20 shadow-inner">
            <span className="text-4xl">🛍️</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 italic font-serif">Empty Manifest</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Your acquisition history is currently blank.</p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 text-sm uppercase tracking-widest"
        >
          Begin Procurement
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const item = order?.orderItems?.[0];
        const isCancelled = order.isCancelled;
        
        let statusText = "Processing";
        let statusColor = "text-emerald-500";
        let statusBg = "bg-emerald-500/10 border-emerald-500/20";
        
        if (isCancelled) {
          statusText = "Terminated";
          statusColor = "text-rose-500";
          statusBg = "bg-rose-500/10 border-rose-500/20";
        } else if (order.isDelivered) {
          statusText = "Completed";
          statusColor = "text-emerald-500";
          statusBg = "bg-emerald-500/10 border-emerald-500/20";
        } else if (order.isOutForDelivery) {
          statusText = "Final Transit";
          statusColor = "text-blue-500";
          statusBg = "bg-blue-500/10 border-blue-500/20";
        } else if (order.isShipped) {
          statusText = "Dispatched";
          statusColor = "text-teal-500";
          statusBg = "bg-teal-500/10 border-teal-500/20";
        } else if (order.isPacked) {
          statusText = "Sealed";
          statusColor = "text-emerald-400";
          statusBg = "bg-emerald-400/10 border-emerald-400/20";
        }

        return (
          <Link
            key={order._id}
            to={`/order/${order._id}`}
            className="block"
          >
            <div className="premium-card rounded-[24px] p-6 flex flex-col sm:flex-row gap-6 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex-shrink-0 relative z-10">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 shadow-sm flex items-center justify-center p-2">
                  <img
                    src={getImageSource(item?.image)}
                    alt={item?.name || "Product"}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
              
              <div className="flex-grow flex flex-col justify-between relative z-10">
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-slate-100 line-clamp-1 italic font-serif group-hover:text-emerald-500 transition-colors">
                      {item?.name || `Batch ORD-${order._id.substring(18).toUpperCase()}`}
                    </h4>
                    <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(order.totalPrice)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      ID: ORD-{order._id.substring(18).toUpperCase()}
                    </span>
                    {order.orderItems?.length > 1 && (
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                        + {order.orderItems.length - 1} Additional Units
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">
                  Registered: <span className="text-slate-600 dark:text-slate-300 ml-1">{formatDate(order.createdAt)}</span>
                </div>

                <div className="mt-4 max-w-sm">
                  <OrderTimeline 
                    isPaid={order.isPaid}
                    isPacked={order.isPacked}
                    isShipped={order.isShipped}
                    isOutForDelivery={order.isOutForDelivery}
                    isDelivered={order.isDelivered}
                    isCancelled={order.isCancelled}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-between sm:items-end sm:ml-4 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-5 sm:pt-0 sm:pl-6 mt-4 sm:mt-0 relative z-10">
                <div className="mb-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm ${statusBg} ${statusColor}`}>
                    {statusText}
                  </span>
                </div>
                
                <div className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-700 text-white group-hover:bg-black dark:group-hover:bg-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-sm">
                  View Details &rarr;
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default MyOrders;
