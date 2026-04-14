import React from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

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

const MyOrders = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  if (isLoading) return <Loader />;

  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || error?.message || "Failed to load orders"}
      </Message>
    );

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-center">
        <div className="mb-4">
          <div className="mx-auto bg-slate-100 dark:bg-slate-700 rounded-full w-24 h-24 mb-3 flex items-center justify-center">
            <span className="text-4xl">🛍️</span>
          </div>
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">No Orders Yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Looks like you haven't made any purchases.</p>
        </div>
        <Link
          to="/shop"
          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-6 rounded transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const item = order?.orderItems?.[0];
        const isCancelled = order.isCancelled;
        const statusText = isCancelled ? "Cancelled" : (order.isDelivered ? "Delivered" : order.isOutForDelivery ? "Out for Delivery" : order.isShipped ? "Shipped" : order.isPacked ? "Packed" : "Processing");
        const statusColor = isCancelled ? "text-red-600" : (order.isDelivered ? "text-green-600" : "text-teal-500");
        const statusBg = isCancelled ? "bg-red-100 dark:bg-red-900/30" : (order.isDelivered ? "bg-green-100 dark:bg-green-900/30" : "bg-teal-100 dark:bg-teal-900/30");

        return (
          <div key={order._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition">
            <div className="flex-shrink-0">
              <img
                src={item?.image || "https://via.placeholder.com/80"}
                alt={item?.name || "Product"}
                className="w-24 h-24 object-cover rounded border border-slate-100 dark:border-slate-600"
              />
            </div>
            
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-slate-100 line-clamp-1">{item?.name || `Order ORD-${order._id.substring(18).toUpperCase()}`}</h4>
                  <span className="font-semibold text-gray-900 dark:text-slate-100">{formatCurrency(order.totalPrice)}</span>
                </div>
                <p className="text-xs font-mono text-gray-500 mt-1 uppercase tracking-wider">ID: ORD-{order._id.substring(18).toUpperCase()}</p>
                {order.orderItems?.length > 1 && (
                  <p className="text-sm text-gray-500 dark:text-slate-400">+{order.orderItems.length - 1} more items</p>
                )}
              </div>
              
              <div className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                Ordered on {formatDate(order.createdAt)}
              </div>
            </div>

            <div className="flex flex-col justify-between sm:items-end sm:ml-4 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 pt-3 sm:pt-0 sm:pl-4 mt-3 sm:mt-0">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBg} ${statusColor}`}>
                  {statusText}
                </span>
              </div>
              <Link
                to={`/order/${order._id}`}
                className="text-center sm:text-right text-emerald-500 hover:text-emerald-600 font-medium text-sm transition"
              >
                View Details &rarr;
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;
