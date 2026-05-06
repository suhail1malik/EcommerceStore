import React from 'react';
import { FaShippingFast, FaShieldAlt, FaUndoAlt, FaHeadset } from 'react-icons/fa';

const FeaturesSection = () => {
  const features = [
    {
      icon: <FaShippingFast className="text-3xl text-indigo-500" />,
      title: "Free Delivery",
      desc: "On all orders above ₹999"
    },
    {
      icon: <FaShieldAlt className="text-3xl text-emerald-500" />,
      title: "Secure Payment",
      desc: "100% protected transactions"
    },
    {
      icon: <FaUndoAlt className="text-3xl text-indigo-500" />,
      title: "Easy Returns",
      desc: "30-day hassle-free return policy"
    },
    {
      icon: <FaHeadset className="text-3xl text-emerald-500" />,
      title: "24/7 Support",
      desc: "Dedicated assistance anytime"
    }
  ];

  return (
    <section className="py-12 bg-white dark:bg-slate-950/50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory lg:grid lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="premium-card p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] flex items-center gap-4 sm:gap-5 hover:border-indigo-500/30 transition-all reveal group shrink-0 snap-start w-[240px] sm:w-auto"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <div className="scale-75 sm:scale-100">{f.icon}</div>
              </div>
              <div className="text-left">
                <h3 className="text-[11px] sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-0.5">
                  {f.title}
                </h3>
                <p className="text-[9px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
