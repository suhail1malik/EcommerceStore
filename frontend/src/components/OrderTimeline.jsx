import React from "react";
import { FaCheck, FaBox, FaShippingFast, FaTruck, FaHome } from "react-icons/fa";

const OrderTimeline = ({ 
  isPaid, 
  isPacked, 
  isShipped, 
  isOutForDelivery, 
  isDelivered, 
  isCancelled,
  paidAt,
  packedAt,
  shippedAt,
  outForDeliveryAt,
  deliveredAt,
  createdAt
}) => {
  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const steps = [
    { id: 1, label: "Placed", icon: <FaCheck />, active: true, completed: isPaid, date: createdAt },
    { id: 2, label: "Packed", icon: <FaBox />, active: isPaid, completed: isPacked, date: packedAt },
    { id: 3, label: "Shipped", icon: <FaShippingFast />, active: isPacked, completed: isShipped, date: shippedAt },
    { id: 4, label: "Transit", icon: <FaTruck />, active: isShipped, completed: isOutForDelivery, date: outForDeliveryAt },
    { id: 5, label: "Delivered", icon: <FaHome />, active: isOutForDelivery, completed: isDelivered, date: deliveredAt },
  ];

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-800 font-bold text-xs uppercase tracking-widest">
         <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
         Order Terminated / Cancelled
      </div>
    );
  }

  return (
    <div className="w-full py-4 px-2">
      <div className="relative flex items-center justify-between">
        {/* Progress Line Background */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />
        
        {/* Progress Line Active */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-1000 ease-out"
          style={{ 
            width: `${((steps.filter(s => s.completed).length - 1) / (steps.length - 1)) * 100}%` 
          }}
        />

        {steps.map((step, index) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
            <div 
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                step.completed 
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30" 
                  : step.active
                  ? "bg-white dark:bg-slate-900 border-emerald-500 text-emerald-500 scale-110"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700"
              }`}
            >
              <span className="text-xs md:text-sm">
                {step.completed ? <FaCheck /> : step.icon}
              </span>
            </div>
            <div className="text-center">
              <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-tight ${
                step.completed ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-600"
              }`}>
                {step.label}
              </p>
              {step.date && (
                <p className="text-[7px] md:text-[8px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono whitespace-nowrap">
                  {formatDate(step.date)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTimeline;
