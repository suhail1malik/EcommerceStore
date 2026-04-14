// src/pages/admin/OrderList.jsx
import React, { useState } from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { 
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useMarkAsPackedMutation,
  useMarkAsShippedMutation,
  useMarkAsOutForDeliveryMutation
} from "../../redux/api/orderApiSlice";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaChevronRight, FaBoxOpen, FaMoneyBillWave, FaCheckCircle, FaEdit, FaFilePdf 
} from "react-icons/fa";
import { toast } from "react-toastify";
import { generateInvoicePDF } from "../../utils/invoiceGenerator";

const formatDate = (iso) => {
  if (!iso) return "N/A";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  } catch {
    return iso.substring(0, 10);
  }
};

const formatCurrency = (num) => {
  if (num == null) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(num));
};

const OrderRow = ({ order, refetchOrders }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [markAsPacked, { isLoading: loadingPacked }] = useMarkAsPackedMutation();
  const [markAsShipped, { isLoading: loadingShipped }] = useMarkAsShippedMutation();
  const [markAsOutForDelivery, { isLoading: loadingOutForDelivery }] = useMarkAsOutForDeliveryMutation();

  const handleStatusChange = async (newStatus) => {
    setStatusDropdownOpen(false);
    try {
      if (newStatus === "Packed") await markAsPacked(order._id).unwrap();
      else if (newStatus === "Shipped") await markAsShipped(order._id).unwrap();
      else if (newStatus === "OutForDelivery") await markAsOutForDelivery(order._id).unwrap();
      else if (newStatus === "Delivered") await deliverOrder(order._id).unwrap();
      
      toast.success(`Order marked as ${newStatus}`);
      if (refetchOrders) refetchOrders();
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to update status");
    }
  };

  let currentStatus = "Pending";
  if (order.isDelivered) currentStatus = "Delivered";
  else if (order.isOutForDelivery) currentStatus = "OutForDelivery";
  else if (order.isShipped) currentStatus = "Shipped";
  else if (order.isPacked) currentStatus = "Packed";

  const isUpdating = loadingDeliver || loadingPacked || loadingShipped || loadingOutForDelivery;

  return (
    <div className={`relative group bg-white dark:bg-slate-800 rounded-[20px] md:rounded-[24px] border transition-all duration-500 ${
      isExpanded 
        ? "border-emerald-200 dark:border-emerald-500/30 shadow-xl ring-1 ring-emerald-100 dark:ring-emerald-500/20" 
        : "border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600"
    }`}>
      {/* Header Row */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
          isExpanded ? "rounded-t-[20px] md:rounded-t-[24px]" : "rounded-[20px] md:rounded-[24px]"
        }`}
      >
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-900 shrink-0 border border-gray-200 dark:border-slate-700">
            {order.orderItems?.[0]?.image ? (
              <img src={order.orderItems[0].image} alt="Order item" className="w-full h-full object-cover" />
            ) : (
              <FaBoxOpen className="w-6 h-6 m-auto absolute inset-0 text-gray-300 dark:text-gray-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                ORD-{order._id.substring(18).toUpperCase()}
              </span>
              <div className={`w-1.5 h-1.5 rounded-full ${order.isDelivered ? "bg-green-500" : order.isPaid ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}`} />
            </div>
            <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-slate-100 line-clamp-1">
              {order.user?.username || order.user?.name || "Guest Check-out"}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
           <div className="hidden sm:block text-right">
              <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-slate-100">{formatCurrency(order.totalPrice)}</p>
              <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">{order.orderItems?.length || 0} Items</p>
           </div>
           <FaChevronRight className={`w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform duration-500 ${isExpanded ? "rotate-90 text-emerald-500 dark:text-emerald-400" : "group-hover:translate-x-1"}`} />
        </div>
      </button>

      {/* Expanded Details & Dropdown Modifier */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="rounded-b-[20px] md:rounded-b-[24px] overflow-visible"
          >
            <div className="px-4 pb-6 md:px-8 md:pb-8 pt-2 border-t border-gray-100 dark:border-slate-700/50">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
                  {/* Left Column - Shipping & Pay */}
                  <div className="lg:col-span-4 space-y-4">
                     <div className="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-4 md:p-5 border border-gray-100 dark:border-slate-700/50">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-3">Shipping Core Link</h4>
                        <p className="text-sm text-gray-700 dark:text-slate-300 font-medium leading-relaxed">{order.shippingAddress?.address || "No address"}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700/50">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">Customer Details</h4>
                          <p className="text-sm text-gray-700 dark:text-slate-300 font-medium">{order.user?.username || order.user?.name || "Guest Check-out"}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{order.user?.email || "No email available"}</p>
                        </div>
                     </div>
                     <div className="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-4 md:p-5 border border-gray-100 dark:border-slate-700/50 flex flex-row items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-1">Authorization</p>
                          <p className={`text-sm font-bold ${order.isPaid ? 'text-green-600 dark:text-green-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                             {order.isPaid ? "Digitally Paid" : order.paymentMethod}
                          </p>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.isPaid ? 'bg-green-100 dark:bg-green-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
                           <FaMoneyBillWave className={`w-4 h-4 ${order.isPaid ? 'text-green-600 dark:text-green-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                        </div>
                     </div>
                  </div>

                  {/* Right Column - Stats & Modification Dropdown */}
                  <div className="lg:col-span-8 flex flex-col h-full">
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        <div className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700/50">
                           <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Receipt Date</p>
                           <p className="text-xs font-bold text-gray-700 dark:text-slate-300 truncate">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700/50">
                           <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Gross Sub</p>
                           <p className="text-xs font-bold text-gray-700 dark:text-slate-300 truncate">{formatCurrency(order.itemsPrice)}</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700/50">
                           <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">State Tax</p>
                           <p className="text-xs font-bold text-gray-700 dark:text-slate-300 truncate">{formatCurrency(order.taxPrice)}</p>
                        </div>
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                           <p className="text-[9px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest mb-1">Net Valuation</p>
                           <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 truncate">{formatCurrency(order.totalPrice)}</p>
                        </div>
                     </div>

                     {/* The Target "Modify Dropdown" & Actions */}
                     <div className="mt-auto flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-gray-100 dark:border-slate-700/50">
                        <div className="flex-1 w-full relative group/drop">
                           {/* Custom Modifier Dropdown */}
                           <button 
                             onClick={(e) => { e.preventDefault(); setStatusDropdownOpen(!statusDropdownOpen); }}
                             onBlur={() => setTimeout(() => setStatusDropdownOpen(false), 200)}
                             disabled={isUpdating || (!order.isPaid && order.paymentMethod !== "CashOnDelivery")}
                             className="w-full relative flex items-center justify-between bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm px-5 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                             <span className="truncate">{
                               currentStatus === "Delivered" ? "Change to » Delivered" :
                               currentStatus === "OutForDelivery" ? "Change to » Out For Delivery" :
                               currentStatus === "Shipped" ? "Change to » Shipped" :
                               currentStatus === "Packed" ? "Change to » Packed" :
                               "Pending processing block"
                             }</span>
                             <FaChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform ${statusDropdownOpen ? 'rotate-90' : ''}`} />
                           </button>

                           <AnimatePresence>
                             {statusDropdownOpen && (
                               <motion.div
                                 initial={{ opacity: 0, y: -5, scale: 0.98 }}
                                 animate={{ opacity: 1, y: 0, scale: 1 }}
                                 exit={{ opacity: 0, y: -5, scale: 0.98 }}
                                 transition={{ duration: 0.15 }}
                                 className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-xl"
                               >
                                 {[
                                   { value: "Pending", label: "Pending processing block", disabled: true },
                                   { value: "Packed", label: "Change to » Packed", disabled: order.isPacked },
                                   { value: "Shipped", label: "Change to » Shipped", disabled: !order.isPacked || order.isShipped },
                                   { value: "OutForDelivery", label: "Change to » Out For Delivery", disabled: !order.isShipped || order.isOutForDelivery },
                                   { value: "Delivered", label: "Change to » Delivered", disabled: !order.isOutForDelivery || order.isDelivered },
                                 ].map((opt) => (
                                   <button
                                     key={opt.value}
                                     onClick={(e) => { e.preventDefault(); handleStatusChange(opt.value); }}
                                     disabled={opt.disabled}
                                     className="w-full text-left px-5 py-4 text-sm font-medium transition-colors border-b border-gray-100 dark:border-slate-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:bg-gray-100 dark:disabled:bg-slate-900/50 disabled:cursor-not-allowed"
                                   >
                                     {opt.label}
                                   </button>
                                 ))}
                               </motion.div>
                             )}
                           </AnimatePresence>
                        </div>
                        
                        <button 
                           onClick={() => generateInvoicePDF(order)}
                           className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm"
                        >
                           <FaFilePdf className="w-4 h-4 text-rose-500" />
                           Preview Invoice
                        </button>
                        
                        <Link 
                           to={`/order/${order._id}`}
                           className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 dark:bg-emerald-600 text-white hover:bg-black dark:hover:bg-emerald-700 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-gray-900/10 dark:shadow-emerald-900/20"
                        >
                           <FaEdit className="w-4 h-4" />
                           Full Details
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OrderList = ({ insideDashboard = false }) => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [filter, setFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  const filteredOrders = orders?.filter((o) => {
    // 1. Status Filter
    if (filter === "new" && (o.isPaid || o.paymentMethod === "CashOnDelivery")) return false;
    if (filter === "paid" && !o.isPaid) return false;
    if (filter === "cod" && o.paymentMethod !== "CashOnDelivery") return false;
    if (filter === "delivered" && !o.isDelivered) return false;

    // 2. Date Filter
    if (dateFilter !== "all" && o.createdAt) {
      const orderDate = new Date(o.createdAt);
      const now = new Date();
      if (dateFilter === "24h") {
        if (now - orderDate > 24 * 60 * 60 * 1000) return false;
      } else if (dateFilter === "7d") {
        if (now - orderDate > 7 * 24 * 60 * 60 * 1000) return false;
      } else if (dateFilter === "custom") {
        if (customRange.start) {
          const start = new Date(customRange.start);
          start.setHours(0, 0, 0, 0);
          if (orderDate < start) return false;
        }
        if (customRange.end) {
          const end = new Date(customRange.end);
          end.setHours(23, 59, 59, 999);
          if (orderDate > end) return false;
        }
      }
    }

    return true;
  });

  return (
    <div className={`${insideDashboard ? 'p-0 w-full' : 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
      {/* Header and Filter Tabs */}
      {!insideDashboard && (
        <div className="mb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Order Logs</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 font-medium">Manage and modify incoming fulfillments.</p>
          </div>
          <div className="flex flex-col gap-4">
            {/* Status Filter */}
            <div className="flex flex-wrap bg-gray-100 dark:bg-slate-800 p-1.5 rounded-[16px] border border-gray-200 dark:border-slate-700/50 shadow-sm self-start xl:self-end">
              {["all", "new", "paid", "cod", "delivered"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`capitalize px-5 py-2 text-sm font-bold rounded-xl transition-all ${
                    filter === f
                      ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm"
                      : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200"
                  }`}
                >
                  {f === "cod" ? "COD" : f}
                </button>
              ))}
            </div>

            {/* Date Filter */}
            <div className="flex flex-wrap items-center gap-3 xl:self-end">
              <div className="flex flex-wrap bg-gray-100 dark:bg-slate-800 p-1.5 rounded-[16px] border border-gray-200 dark:border-slate-700/50 shadow-sm">
                {[
                  { id: "all", label: "All Time" },
                  { id: "24h", label: "Last 24 Hrs" },
                  { id: "7d", label: "Last 7 Days" },
                  { id: "custom", label: "Custom Dates" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setDateFilter(f.id)}
                    className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                      dateFilter === f.id
                        ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm"
                        : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Custom Date Inputs */}
              <AnimatePresence>
                {dateFilter === "custom" && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2 ml-1"
                  >
                    <input 
                      type="date" 
                      value={customRange.start}
                      onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                      className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-emerald-500 shadow-sm"
                    />
                    <span className="text-gray-400 font-bold px-1 text-sm">to</span>
                    <input 
                      type="date" 
                      value={customRange.end}
                      onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                      className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-emerald-500 shadow-sm"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* Expandable Order List */}
      {isLoading ? (
        <div className="space-y-4">
           {[1,2,3].map(n => (
             <div key={n} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[24px] p-6 h-[90px] animate-pulse flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-xl" />
                  <div>
                    <div className="w-24 h-3 bg-gray-100 dark:bg-slate-700 rounded mb-2" />
                    <div className="w-32 h-4 bg-gray-100 dark:bg-slate-700 rounded" />
                  </div>
                </div>
             </div>
           ))}
        </div>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.message || "Failed to load orders"}
        </Message>
      ) : (
        <div className="space-y-4">
          {filteredOrders?.map((order) => (
            <OrderRow key={order._id} order={order} refetchOrders={refetch} />
          ))}
          
          {filteredOrders?.length === 0 && (
            <div className="py-20 text-center">
               <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 text-gray-300 dark:text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-slate-700">
                 <FaBoxOpen className="w-6 h-6" />
               </div>
               <p className="text-gray-400 dark:text-slate-500 font-medium">No matching orders found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderList;
