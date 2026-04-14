import React from 'react';

const SkeletonProductCard = () => {
  return (
    <div className="w-[18rem] p-4 bg-white dark:bg-[#1a1a1a] rounded shadow-md mx-auto animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-[200px] bg-gray-300 dark:bg-slate-700 rounded mb-4" />
      
      {/* Title Skeleton */}
      <div className="h-6 bg-gray-300 dark:bg-slate-700 rounded w-3/4 mb-4" />
      
      {/* Price Skeleton */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-gray-300 dark:bg-slate-700 rounded w-1/3" />
        <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-1/4" />
      </div>
      
      {/* Description Skeleton */}
      <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-full mb-2" />
      <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-5/6 mb-4" />
      
      {/* Button Skeleton */}
      <div className="h-10 bg-gray-300 dark:bg-slate-700 rounded w-full mt-4" />
    </div>
  );
};

export default SkeletonProductCard;
