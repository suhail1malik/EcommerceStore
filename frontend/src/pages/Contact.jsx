import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-6xl mx-auto px-6 py-20 min-h-screen"
    >
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 italic font-serif">Contact Our Team</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Have a question or need assistance? Reach out to us and experience our premium support.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="premium-card p-6 rounded-2xl flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-xl">
              <FaEnvelope />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Email Us</h3>
              <p className="text-slate-500 dark:text-slate-400">support@commercehub.com</p>
            </div>
          </div>
          <div className="premium-card p-6 rounded-2xl flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-xl">
              <FaPhone />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Call Us</h3>
              <p className="text-slate-500 dark:text-slate-400">+1 (800) 123-4567</p>
            </div>
          </div>
          <div className="premium-card p-6 rounded-2xl flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-xl">
              <FaMapMarkerAlt />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Global Headquarters</h3>
              <p className="text-slate-500 dark:text-slate-400">77 Silicon Valley, Tech Plaza, CA</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="premium-card p-8 rounded-3xl space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message</label>
            <textarea 
              rows="4" 
              required
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="How can we help you?"
            ></textarea>
          </div>
          <button type="submit" className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-95">
            Send Message
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Contact;
