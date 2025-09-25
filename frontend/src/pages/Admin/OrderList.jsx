// src/pages/admin/OrderList.jsx
import React from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

// Small Badge component for status
const StatusBadge = ({
  isTrue,
  trueText = "Completed",
  falseText = "Pending",
}) => (
  <span
    role="status"
    aria-atomic="true"
    className={`inline-block px-3 py-1 text-sm rounded-full ${
      isTrue ? "bg-green-400 text-black" : "bg-red-400 text-black"
    }`}
  >
    {isTrue ? trueText : falseText}
  </span>
);

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  // Helper for safe formatting
  const formatDate = (iso) => {
    if (!iso) return "N/A";
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso.substring(0, 10);
    }
  };

  const formatCurrency = (num) => {
    if (num == null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(num));
  };

  return (
    <div className="container mx-auto px-4">
      <AdminMenu />

      {isLoading ? (
        <div className="my-8">
          <Loader />
        </div>
      ) : error ? (
        <div className="my-8">
          <Message variant="danger">
            {error?.data?.message || error?.message || JSON.stringify(error)}
          </Message>
        </div>
      ) : (
        <div className="my-8 overflow-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="text-left p-2">ITEMS</th>
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">USER</th>
                <th className="text-left p-2">DATE</th>
                <th className="text-left p-2">TOTAL</th>
                <th className="text-left p-2">PAID</th>
                <th className="text-left p-2">DELIVERED</th>
                <th className="text-left p-2"></th>
              </tr>
            </thead>

            <tbody>
              {orders?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders?.map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="p-2 align-top">
                      {/* first item image; lazy load and add alt */}
                      <img
                        src={order.orderItems?.[0]?.image || ""}
                        alt={
                          order.orderItems?.[0]?.name || `Order ${order._id}`
                        }
                        className="w-20 h-auto object-cover"
                        loading="lazy"
                      />
                    </td>

                    <td className="p-2 align-top break-words">{order._id}</td>

                    <td className="p-2 align-top">
                      {order.user?.username || order.user?.name || "N/A"}
                    </td>

                    <td className="p-2 align-top">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="p-2 align-top">
                      {formatCurrency(order.totalPrice)}
                    </td>

                    <td className="p-2 align-top">
                      <StatusBadge
                        isTrue={!!order.isPaid}
                        trueText="Completed"
                        falseText="Pending"
                      />
                    </td>

                    <td className="p-2 align-top">
                      <StatusBadge
                        isTrue={!!order.isDelivered}
                        trueText="Completed"
                        falseText="Pending"
                      />
                    </td>

                    <td className="p-2 align-top">
                      <Link
                        to={`/admin/order/${order._id}`}
                        aria-label={`View order ${order._id}`}
                      >
                        <button className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700">
                          More
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
