import React from "react";
import { motion } from "framer-motion";

const Privacy = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-20 max-w-4xl"
    >
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-8 italic font-serif">Privacy Policy</h1>
      <div className="premium-card rounded-[32px] p-8 sm:p-12 prose dark:prose-invert max-w-none">
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          At Luxury E-Store, we take your privacy seriously. This policy outlines how we handle your personal data.
        </p>
        
        <h2 className="text-2xl font-bold mt-10 mb-4">Data Collection</h2>
        <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact support. This includes your name, email, address, and payment information.</p>
        
        <h2 className="text-2xl font-bold mt-10 mb-4">How We Use Your Data</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To process transactions and manage your account.</li>
          <li>To provide customer support and respond to inquiries.</li>
          <li>To send technical notices, updates, and security alerts.</li>
          <li>To personalize your shopping experience.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">Security Protocol</h2>
        <p>We implement state-of-the-art security measures including SSL encryption and secure digital gateways to protect your sensitive information during transmission and settlement.</p>
        
        <p className="mt-12 text-sm text-slate-500 italic">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </motion.div>
  );
};

export default Privacy;
