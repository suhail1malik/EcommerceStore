import React from 'react';

const SkeletonProductCard = () => {
  return (
    <div className="w-full flex flex-col premium-card rounded-2xl overflow-hidden relative">
      <div className="shimmer absolute inset-0 z-10" />
      
      {/* Image Skeleton */}
      <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800/50 w-full" />
      
      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col gap-3">
        <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-800/50 rounded-lg" />
        <div className="h-2 w-1/4 bg-slate-200 dark:bg-slate-800/50 rounded-full" />
        
        <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800/50 rounded-lg mt-2" />
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50 dark:border-slate-800/50">
           <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800/50 rounded-lg" />
           <div className="h-3 w-10 bg-slate-200 dark:bg-slate-800/50 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductCard;
