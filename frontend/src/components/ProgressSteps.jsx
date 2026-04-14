import React from 'react';
import { FaCheck } from 'react-icons/fa';

const ProgressSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { name: 'Login', active: step1 },
    { name: 'Shipping', active: step2 },
    { name: 'Payment', active: step3 },
    { name: 'Place Order', active: step4 },
  ];

  return (
    <div className="flex items-center justify-center w-full max-w-2xl mx-auto my-8 px-4 font-dmsans">
      {steps.map((step, index) => (
        <React.Fragment key={step.name}>
          {/* Step Node */}
          <div className="flex flex-col items-center relative z-10 text-center w-20">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-3 transition-all duration-300 ${
                step.active
                  ? "bg-[#10b981] text-[#0a0f1e] shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  : "bg-white/5 text-slate-500 border border-white/10 dark:bg-[#111827]"
              }`}
            >
              {step.active ? (
                // If the next step is active, the current step is "completed" and gets a checkmark.
                index < steps.length - 1 && steps[index + 1]?.active ? (
                  <FaCheck />
                ) : (
                  index + 1
                )
              ) : (
                index + 1
              )}
            </div>
            <span
              className={`text-[11px] sm:text-xs font-bold tracking-widest uppercase ${
                step.active ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-slate-600"
              }`}
            >
              {step.name}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className="flex-1 h-1 relative -top-[14px] mx-1 sm:mx-3">
               {/* Background Track */}
               <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-full" />
               {/* Active Track */}
               <div 
                 className="absolute inset-0 bg-[#10b981] rounded-full transition-all duration-500 origin-left" 
                 style={{ 
                   transform: steps[index + 1]?.active ? 'scaleX(1)' : 'scaleX(0)' 
                 }} 
               />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressSteps;