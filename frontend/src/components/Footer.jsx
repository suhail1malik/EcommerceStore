import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaCcVisa, FaCcMastercard, FaPaypal } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-12 md:pt-16 pb-20 md:pb-8 mt-auto z-10 relative mb-0">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-8">
          
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-serif mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              LUXURY<span className="text-emerald-500">.</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 pr-4 leading-relaxed tracking-wide">
              Curated essentials for the modern lifestyle. Experience premium quality, secure checkout, and worldwide premium shipping.
            </p>
            <div className="flex gap-4 mt-6 text-slate-400">
              <a href="#" className="hover:text-emerald-500 transition-colors"><FaFacebook size={20} /></a>
              <a href="#" className="hover:text-emerald-500 transition-colors"><FaTwitter size={20} /></a>
              <a href="#" className="hover:text-emerald-500 transition-colors"><FaInstagram size={20} /></a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-wider uppercase mb-4">Shop</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <li><Link to="/shop" className="hover:text-emerald-500 transition-colors">All Products</Link></li>
              <li><Link to="#" className="hover:text-emerald-500 transition-colors">New Arrivals</Link></li>
              <li><Link to="#" className="hover:text-emerald-500 transition-colors">Top Rated</Link></li>
              <li><Link to="#" className="hover:text-emerald-500 transition-colors">Sale & Offers</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <li><Link to="#" className="hover:text-emerald-500 transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-emerald-500 transition-colors">FAQ</Link></li>
              <li><Link to="#" className="hover:text-emerald-500 transition-colors">Shipping Returns</Link></li>
              <li><Link to="#" className="hover:text-emerald-500 transition-colors">Order Tracking</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <li><Link to="#" className="hover:text-emerald-500 transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-emerald-500 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            &copy; {new Date().getFullYear()} Luxury E-Commerce. All rights reserved.
          </p>
          <div className="flex gap-4 text-slate-300 dark:text-slate-600">
            <FaCcVisa size={30} />
            <FaCcMastercard size={30} />
            <FaPaypal size={30} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
