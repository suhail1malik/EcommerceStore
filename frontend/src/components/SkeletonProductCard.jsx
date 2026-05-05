import React from 'react';

const SkeletonProductCard = () => {
  return (
    <div className="w-full flex flex-col premium-card rounded-[24px] overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-slate-200 dark:bg-slate-800/50 w-full" />
      
      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div className="h-2 w-16 bg-slate-200 dark:bg-slate-800/50 rounded-full" />
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800/50 rounded-lg" />
        
        <div className="flex justify-between items-center mt-2">
          <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800/50 rounded-lg" />
          <div className="h-4 w-10 bg-slate-200 dark:bg-slate-800/50 rounded-lg" />
        </div>

        {/* Action button skeleton */}
        <div className="h-10 w-full bg-slate-100 dark:bg-slate-800/30 rounded-xl mt-2" />
      </div>
    </div>
  );
};

export default SkeletonProductCard;
