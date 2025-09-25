// src/pages/order/UserOrder.jsx
import React from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const StatusBadge = ({ positive, text }) => (
  <span
    role="status"
    className={`inline-block px-3 py-1 text-sm rounded-full ${
      positive ? "bg-green-400 text-black" : "bg-red-400 text-black"
    }`}
  >
    {text}
  </span>
);

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
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso.substring(0, 10);
  }
};

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  if (isLoading) return <Loader />;

  if (error)
    return (
      <div className="container mx-auto px-4 py-6">
        <Message variant="danger">
          {error?.data?.message || error?.message || JSON.stringify(error)}
        </Message>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-slate-100">
        My Orders
      </h2>

      {!orders || orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <Message>You have no orders yet.</Message>
          <div className="mt-4">
            <Link
              to="/shop"
              className="text-indigo-600 dark:text-indigo-300 hover:underline"
            >
              Go to shop
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-slate-300">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-slate-300">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-slate-300">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-slate-300">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-slate-300">
                  Paid
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-slate-300">
                  Delivered
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {orders.map((order) => (
                <tr key={order._id} className="align-top">
                  <td className="px-4 py-4">
                    <img
                      src={
                        order?.orderItems?.[0]?.image ||
                        "https://via.placeholder.com/80x80/374151/9ca3af?text=No+Image"
                      }
                      alt={order?.orderItems?.[0]?.name || `order-${order._id}`}
                      className="w-20 h-20 object-cover rounded"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://via.placeholder.com/80x80/374151/9ca3af?text=No+Image";
                      }}
                    />
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-slate-100 break-words">
                    {order._id}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-slate-300">
                    {formatDate(order.createdAt)}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-slate-100">
                    {formatCurrency(order.totalPrice)}
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge
                      positive={!!order.isPaid}
                      text={order.isPaid ? "Completed" : "Pending"}
                    />
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge
                      positive={!!order.isDelivered}
                      text={order.isDelivered ? "Completed" : "Pending"}
                    />
                  </td>

                  <td className="px-4 py-4 text-right">
                    <Link to={`/order/${order._id}`}>
                      <button
                        className="inline-flex items-center px-3 py-1 rounded bg-pink-500 hover:bg-pink-600 text-white"
                        aria-label={`View order ${order._id}`}
                      >
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrder;
