import React from 'react';

const OrderStepper = ({ order }) => {
  if (!order) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (order?.isCancelled) {
    return (
      <div className="w-full py-4 mb-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-4 text-red-600 dark:text-red-400">
          <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <h3 className="font-semibold text-lg">Order Cancelled</h3>
            <p className="text-sm opacity-90">This order was cancelled on {formatDate(order?.cancelledAt) || "N/A"}</p>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { label: "Confirmed", date: order?.createdAt, completed: true },
    { label: "Packed", date: order?.packedAt, completed: !!order?.isPacked },
    { label: "Shipped", date: order?.shippedAt, completed: !!order?.isShipped },
    { label: "Out for Delivery", date: order?.outForDeliveryAt, completed: !!order?.isOutForDelivery },
    { label: "Delivered", date: order?.deliveredAt, completed: !!order?.isDelivered }
  ];

  let activeIndex = 0;
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i].completed) {
      activeIndex = i;
      break;
    }
  }

  let progressPercent = 0;
  if (order?.isDelivered) progressPercent = 100;
  else if (order?.isOutForDelivery) progressPercent = 75;
  else if (order?.isShipped) progressPercent = 50;
  else if (order?.isPacked) progressPercent = 25;

  const firstStep = steps[0];
  const lastStep = steps[steps.length - 1];

  return (
    <div className="w-full py-4 sm:py-6 mb-2 sm:mb-6 overflow-hidden px-2">
      
      {/* ---------------- 5-NODE STEPPER (Desktop OR Mobile-in-progress) ---------------- */}
      <div className={`${lastStep.completed ? 'hidden sm:flex' : 'flex'} flex-row items-start justify-between relative`}>
        {steps.map((step, index) => {
          const isCompleted = step.completed;
          const isLast = index === steps.length - 1;
          const nextCompleted = !isLast && steps[index + 1].completed;
          const isActive = index === activeIndex;
          
          return (
            <div key={index} className="flex-1 flex flex-col relative w-full items-center">
              
              {/* Horizontal Line */}
              {!isLast && (
                <div className={`absolute top-[1.25rem] left-[50%] w-full h-[3px] z-0 transition-colors duration-300 ${nextCompleted ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`}></div>
              )}

              <div className="flex flex-col items-center gap-2 relative z-10 w-full h-auto">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 shrink-0 transition-colors duration-300 bg-white dark:bg-slate-800 ${
                  isCompleted 
                    ? 'border-emerald-500 text-emerald-500 dark:text-emerald-400' 
                    : 'border-gray-300 text-gray-400 dark:border-slate-600 dark:text-gray-500'
                }`}>
                  {isCompleted ? (
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="text-center mt-2 w-full px-0.5 sm:px-2 block">
                  <p className={`font-medium sm:font-semibold text-[9px] sm:text-xs md:text-sm leading-tight break-words ${isCompleted ? 'text-gray-900 dark:text-slate-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {step.label}
                  </p>
                  <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mt-1 min-h-[1rem] leading-tight">
                    {step.date ? formatDate(step.date) : ""}
                  </p>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ---------------- MOBILE 2-NODE STEPPER (Only when Delivered) ---------------- */}
      {lastStep.completed && (
        <div className="flex sm:hidden flex-row items-start justify-between relative px-2">
          {/* Background Line */}
          <div className="absolute top-[1rem] left-[32px] right-[32px] h-[2px] bg-gray-200 dark:bg-slate-700 z-0"></div>
          {/* Progress Line */}
          <div className="absolute top-[1rem] left-[32px] h-[2px] bg-emerald-500 z-0 transition-all duration-700 ease-out" style={{ width: `calc((100% - 64px) * ${progressPercent / 100})` }}></div>

          {/* Node 1: Confirmed */}
          <div className="flex flex-col relative items-center z-10 w-[80px]">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 transition-colors duration-300 bg-white dark:bg-slate-800 ${
                    firstStep.completed 
                      ? 'border-emerald-500 text-emerald-500 dark:text-emerald-400' 
                      : 'border-gray-300 text-gray-400 dark:border-slate-600 dark:text-gray-500'
                  }`}>
                    {firstStep.completed ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    ) : "1"}
            </div>
            <div className="text-center mt-2 block w-[80px]">
                    <p className={`font-semibold text-[10px] leading-tight ${firstStep.completed ? 'text-gray-900 dark:text-slate-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {firstStep.label}
                    </p>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5 min-h-[1rem]">
                      {firstStep.date ? formatDate(firstStep.date) : ""}
                    </p>
              </div>
          </div>

          {/* Node 2: Delivered */}
          <div className="flex flex-col relative items-center z-10 w-[80px]">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 transition-colors duration-300 bg-white dark:bg-slate-800 ${
                    lastStep.completed 
                      ? 'border-emerald-500 text-emerald-500 dark:text-emerald-400' 
                      : 'border-gray-300 text-gray-400 dark:border-slate-600 dark:text-gray-500'
                  }`}>
                    {lastStep.completed ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    ) : "5"}
            </div>
            <div className="text-center mt-2 block w-[80px]">
                    <p className={`font-semibold text-[10px] leading-tight ${lastStep.completed ? 'text-gray-900 dark:text-slate-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {lastStep.label}
                    </p>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5 min-h-[1rem]">
                      {lastStep.date ? formatDate(lastStep.date) : ""}
                    </p>
              </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderStepper;
