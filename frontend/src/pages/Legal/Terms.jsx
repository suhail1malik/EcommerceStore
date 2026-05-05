import React from "react";
import { motion } from "framer-motion";

const Terms = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-20 max-w-4xl"
    >
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-8 italic font-serif">Terms of Service</h1>
      <div className="premium-card rounded-[32px] p-8 sm:p-12 prose dark:prose-invert max-w-none">
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Welcome to Luxury E-Store. By accessing or using our platform, you agree to be bound by these terms.
        </p>
        
        <h2 className="text-2xl font-bold mt-10 mb-4">Merchant Agreement</h2>
        <p>By placing an order, you agree to settle the total valuation of the inventory items, including logistics fees and estimated levies.</p>
        
        <h2 className="text-2xl font-bold mt-10 mb-4">Logistics & Delivery</h2>
        <p>We aim for efficient fulfillment settlement. Shipping times are estimates and may vary based on your logistics node (destination).</p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Digital Settlement</h2>
        <p>Our digital gateways (Razorpay) are secured protocols. Any fraudulent activity will lead to immediate protocol termination and account suspension.</p>
        
        <h2 className="text-2xl font-bold mt-10 mb-4">Inventory Availability</h2>
        <p>Product availability is subject to change. If a product is depleted post-transaction, we will initiate a reversal protocol (refund).</p>
        
        <p className="mt-12 text-sm text-slate-500 italic">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </motion.div>
  );
};

export default Terms;
